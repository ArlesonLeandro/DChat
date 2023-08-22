const {ipcRenderer, contextBridge} = require('electron')


contextBridge.exposeInMainWorld("api",{
  close: () => ipcRenderer.send("close"),
  minimize: () => ipcRenderer.send("minimize")
});