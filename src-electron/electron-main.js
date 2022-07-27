import {app, ipcMain, nativeTheme} from 'electron'

import path from 'path'
import os from 'os'
import CreateWindow from './create-window/createWindow'
// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) {
}

let mainWindow, startupWindow
const createWindow = new CreateWindow(process.env.APP_URL, true)

app.whenReady().then(() => {
  startupWindow = createWindow.createLoadingWindow()
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createWindow.createMainWindow()
  }
})
ipcMain.on('startupComplete', () => {
  startupWindow && startupWindow.close()
  mainWindow = createWindow.createMainWindow()
})
