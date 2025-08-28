import { ipcMain, BrowserWindow } from 'electron'
// 调整窗口大小
ipcMain.on('set-window-size', (event, width, height) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window.setSize(width, height)
})

// 回到默认大小
ipcMain.on('set-window-size-default', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window.setSize(580, 480)
})
