const {BrowserWindow, Menu, session} = require("electron");
import path from 'path'

class CreateWindow {

  constructor (appUrl, debug) {
    console.log('appUrl', appUrl)
    this.$APP_URL = appUrl
    this.$debug = debug
    this.loadingWindow = null
    this.mainWindow = null
  }

  createLoadingWindow () {   //加载页面窗口
    this.loadingWindow = new BrowserWindow({
      height: 400,
      useContentSize: true,
      width: 300,
      show: true,
      transparent: false,
      maximizable: false,  //禁止双击放大
      frame: false,   // 去掉顶部操作栏
      webPreferences: {
        contextIsolation: true,
        // More info: /quasar-cli/developing-electron-apps/electron-preload-script
        preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
      }
    })

    this.loadingWindow.loadURL(this.$APP_URL)
    Menu.setApplicationMenu(null)
    this.loadingWindow.on('closed', () => {
      this.loadingWindow = null
    })
    return this.loadingWindow
  }

  createMainWindow (pagePath) {
    /**
     * Initial window options
     */
    this.mainWindow = new BrowserWindow({
      icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
      width: 1024,
      height: 768,
      resizable:false,
      useContentSize: true,
      frame: false,
      show: true,
      webPreferences: {
        webSecurity:false,
        contextIsolation: true,
        // More info: /quasar-cli/developing-electron-apps/electron-preload-script
        preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
      }
    })

    pagePath = this.$APP_URL + (pagePath ? pagePath :'#/login')
    console.log('pagePath',pagePath)
    this.mainWindow.loadURL(pagePath);

    if (this.$debug) {
      session.defaultSession.loadExtension('/Users/yfzhu/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.1.4_0/').then();
      // if on DEV or Production with debug enabled
      this.mainWindow.webContents.openDevTools()
    } else {
      // we're on production; no access to devtools pls
      this.mainWindow.webContents.on('devtools-opened', () => {
        this.mainWindow.webContents.closeDevTools()
      })
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
    return this.mainWindow
  }
}

export default CreateWindow
