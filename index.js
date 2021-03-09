const dotenv = require('dotenv')
const {
  app,
  BrowserWindow,
  shell,
  globalShortcut
} = require('electron')
const { PythonShell } = require('python-shell')
const rq = require('request-promise')
const axios = require('axios')

dotenv.config()

const mainAddr = process.env.APP_BASE_URL
console.log('mainAddr', mainAddr)

const axiosClient = axios.create({
  baseUrl: mainAddr
})
axiosClient.interceptors.request.use((req) => {
  console.log('request: ', req)
  return req
})
axiosClient.interceptors.response.use((res) => {
  console.log('response: ', res)
  return res
})
const clipboardApiUrl = 'api/clipboard/receive'

// アプリ作成
function createWindow () {
  // Pythonコード実行
  PythonShell.run('./app/app.py', null, (err, result) => {
    if (err) throw err
    console.log(err)
  })

  // 起動処理
  const startUp = () => {
    rq(mainAddr)
      .then((htmString) => {
        console.log('started app')

        // ブラウザ準備
        const mainWindow = new BrowserWindow({
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          },
          frame: false,
          alwaysOnTop: true,
          useContentSize: true,
          transparent: true,
        })
        mainWindow.webContents.on('new-window', (event, url) => {
          event.preventDefault()
          shell.openExternal(url)
        })
        mainWindow.loadURL(mainAddr)

        // ウィンドウ外のクリックで閉じる
        mainWindow.on('blur', () => {
          app.hide()
        })

        // クリップボード監視起動
        axiosClient.post(`${mainAddr}/${clipboardApiUrl}`)
          .then((res) => {
            console.log('started clipboard')
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        // console.log(err)
        startUp()
      })
  }

  // 起動
  startUp()
}

// 起動準備
app.whenReady()
  .then(createWindow)

// Dockから非表示
app.dock.hide()

// 常駐起動設定
console.log('build', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe')
  })
} else {
  app.setLoginItemSettings({
    openAtLogin: false
  })
}

// 起動準備
app.on('ready', () => {
  // ショートカット登録
  globalShortcut.register('ctrl+space', () => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (mainWindow) {
      mainWindow.center()
      app.hide()
    } else {
      app.focus({steal: true})
      app.show()
    }
  })
})

// アクティブで起動
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// ウィンドウ全終了
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 電源OFF
app.on('will-quit', () => {
  // ショートカット解除
  globalShortcut.unregisterAll()
})

// 終了処理
app.on('quit', () => {
  // クリップボード監視終了
  axiosClient.delete(`${mainAddr}/${clipboardApiUrl}`)
    .then((res) => {
      console.log('finished clipboard')
    })
    .catch((err) => {
      console.log(err)
    })
})