import {ipcMain} from 'electron'

class IpcMainEvent {
  constructor ({createWindow, mainWindow, startupWindow}) {
    this.createWindow = createWindow
    this.mainWindow = mainWindow
    this.startupWindow = startupWindow
  }

  init () {
    this.onStartupComplete()
  }

  onStartupComplete () {
    ipcMain.on('startupComplete', () => {
      this.startupWindow.close()
      this.mainWindow = this.createWindow.createMainWindow()
    })
  }
}

export default IpcMainEvent
