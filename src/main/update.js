// import { autoUpdater } from 'electron-updater'
const { autoUpdater } = require('electron-updater')

let mainWin = null

export function checkUpdate(mainWindow, ipcMain) {
  autoUpdater.autoDownload = true // 自动下载
  autoUpdater.autoInstallOnAppQuit = true // 应用退出后自动安装
  mainWin = mainWindow
  // 检测是否有更新包并通知
  autoUpdater.checkForUpdatesAndNotify().catch()
  // 监听渲染进程的 install 事件，触发退出应用并安装
  ipcMain.handle('install', () => autoUpdater.quitAndInstall())
}

// 监听更新事件
autoUpdater.on('update-available', (info) => {
  mainWin.webContents.send('update-available', info)
})

// 监听下载进度事件
autoUpdater.on('download-progress', (progressObj) => {
  mainWin.webContents.send('download-progress', progressObj)
})

// 监听更新下载完成事件
autoUpdater.on('update-downloaded', (info) => {
  mainWin.webContents.send('update-downloaded', info)
})
