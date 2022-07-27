import {contextBridge, ipcRenderer} from 'electron'

contextBridge.exposeInMainWorld("main", {
  openMainWindow: (path) => {
    ipcRenderer.send("startupComplete", path);
  }
});
