const {
  app,
  BrowserWindow,
  shell,
  globalShortcut
} = require('electron')
const { PythonShell } = require('python-shell')
const axios = require('axios')
const AxiosLogger = require('axios-logger')

// 環境変数読み込み
require('dotenv').config()

// バックエンドアドレス
const mainAddr = process.env.APP_BASE_URL
console.log('mainAddr', mainAddr)

// axios初期化
const axiosClient = axios.create({
  baseURL: mainAddr
})
axiosClient.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
)
axiosClient.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
)

// api url
const apiUrl = 'api'
const clipboardReceiveApiUrl = `${apiUrl}/clipboard/receive`

// アプリ作成
function createWindow () {
  // Pythonコード実行
  PythonShell.run('./app/app.py', null, (err, result) => {
    if (err) throw err
    console.log('error', err)
  })

  // 起動処理
  const startUp = () => {
    axiosClient.get('')
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
        axiosClient.post(clipboardReceiveApiUrl)
          .then((res) => {
            console.log('started clipboard')
          })
          .catch((err) => {
            console.log('error', err)
          })
      })
      .catch((err) => {
        // 起動するまで繰り返す
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
  axiosClient.delete(clipboardReceiveApiUrl)
    .then((res) => {
      console.log('finished clipboard')
    })
    .catch((err) => {
      console.log('error', err)
    })
})