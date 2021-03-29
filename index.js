const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeTheme,
  nativeImage,
  shell,
  globalShortcut
} = require('electron')
const path = require('path')
const { PythonShell } = require('python-shell')
const axios = require('axios')
const AxiosLogger = require('axios-logger')

// 環境変数読み込み
require('dotenv').config()

// バックエンドアドレス
const mainAddr = process.env.APP_BASE_URL
console.log('mainAddr', mainAddr)

// 初期ショートカットキー
const shortcutKey = process.env.APP_SHORTCUT_KEY

// トレイアイコン
let trayIcon = null;

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

let pythonProcess = null

// アプリ作成
function createWindow () {
  // Pythonコード実行
  const pyshell = new PythonShell('./app/app.py')
  pyshell.end((err) => {
    if (err) throw err
    console.log('error', err)
  })
  pythonProcess = pyshell.childProcess

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

// // 起動準備
app.whenReady()
  .then(createWindow)

// Dock非表示
app.dock.hide()

// aboutダイアログ
// app.setAboutPanelOptions({
//   iconPath: ''
// })

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

const showApp = () => {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    mainWindow.center()
    app.hide()
  } else {
    app.focus({ steal: true })
    app.show()

    // リロード
    BrowserWindow.getAllWindows().forEach((v) => {
      v.webContents.loadURL(mainAddr)
    })
  }
}

// 起動準備
app.on('ready', () => {
  // ショートカット登録
  globalShortcut.register(shortcutKey, showApp)

  // トレイ登録
  const trayIconPath = path.join(
    __dirname,
    'assets',
    `clipboard_icon${nativeTheme.shouldUseDarkColors ? '_dark' : ''}.png`
  )  
  trayIcon = new Tray(nativeImage.createFromPath(trayIconPath))
  const contextMenu = Menu.buildFromTemplate([
    { label: `Show window (${shortcutKey.toUpperCase()})`, click: showApp },
    { type: 'separator' },
    { label: `About`, role: 'about' },
    { label: 'Quit', role: 'quit' }
  ])
  trayIcon.setToolTip(app.name)
  trayIcon.setContextMenu(contextMenu)
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

  // バックエンド終了
  pythonProcess.kill('SIGINT')
})