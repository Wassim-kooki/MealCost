const { contextBridge, app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    minWidth: 500,
    minHeight: 500,
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: "icon.ico",
    //transparent: true,
    /*titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#000'
    },*/
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  //ipcMain.handle('ping', () => 'pong')
  setTimeout(createWindow, 500)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})