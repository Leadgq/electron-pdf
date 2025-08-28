import { ipcMain } from 'electron'
import { spawn } from 'child_process'
import { is } from '@electron-toolkit/utils'
import { dialog } from 'electron'
import { shell } from 'electron'
import scriptPathAddress from '../../resources/pythonCode/pdf2doc.py?asset'
import pythonPathAddress from '../../resources/python/python-3.13.5-embed-amd64/python.exe?asset'

const scriptPath = is.dev
  ? scriptPathAddress
  : scriptPathAddress.replace('app.asar', 'app.asar.unpacked')
const pythonPath = is.dev
  ? pythonPathAddress
  : pythonPathAddress.replace('app.asar', 'app.asar.unpacked')

ipcMain.handle('convert-pdf-to-docx', async (_, pdfPath) => {
  const docxPath = pdfPath.replace(/\.pdf$/, '.docx')
  return new Promise((resolve, reject) => {
    const py = spawn(pythonPath, [scriptPath, pdfPath, docxPath, 'convert-pdf-to-docx'])
    py.on('close', (code) => {
      if (code === 0) {
        resolve(docxPath)
        // 系统弹窗
        dialog
          .showMessageBox({
            type: 'info',
            title: '转换成功',
            message: '文件已成功转换为 DOCX 格式'
          })
          .then(() => {
            // 打开文件所在目录
            shell.showItemInFolder(docxPath)
            // 打开文件
            shell.openPath(docxPath)
          })
      } else {
        // 系统弹窗
        dialog
          .showMessageBox({
            type: 'error',
            title: '转换失败',
            message: `转换失败，退出码: ${code}`
          })
          .then(() => {
            reject(new Error(`转换失败，退出码: ${code}`))
          })
      }
    })

    py.on('error', (error) => {
      reject(new Error(`启动 Python 失败: ${error.message}`))
    })
  })
})

ipcMain.handle('convert-docx-to-pdf', async (_, docxPath) => {
  const pdfPath = docxPath.replace(/\.docx$/, '.pdf')
  return new Promise((resolve, reject) => {
    const py = spawn(pythonPath, [scriptPath, pdfPath, docxPath, 'convert-docx-to-pdf'])
    py.on('close', (code) => {
      if (code === 0) {
        resolve(pdfPath)
        // 系统弹窗
        dialog
          .showMessageBox({
            type: 'info',
            title: '转换成功',
            message: '文件已成功转换为 PDF 格式'
          })
          .then(() => {
            // 打开文件所在目录
            shell.showItemInFolder(pdfPath)
            // 打开文件
            shell.openPath(pdfPath)
          })
      } else {
        // 系统弹窗
        dialog
          .showMessageBox({
            type: 'error',
            title: '转换失败',
            message: `转换失败，退出码: ${code}`
          })
          .then(() => {
            reject(new Error(`转换失败，退出码: ${code}`))
          })
      }
    })
    py.on('error', (error) => {
      reject(new Error(`启动 Python 失败: ${error.message}`))
    })
  })
})

// async function checkFileExist(pythonPath, scriptPath) {
//   if (
//     !(await fs.promises
//       .access(pythonPath)
//       .then(() => true)
//       .catch(() => false))
//   ) {
//     dialog.showMessageBox({
//       type: 'error',
//       title: '转换失败',
//       message: `Python 可执行文件不存在: ${pythonPath}`
//     })
//     return false
//   }
//   if (
//     !(await fs.promises
//       .access(scriptPath)
//       .then(() => true)
//       .catch(() => false))
//   ) {
//     dialog.showMessageBox({
//       type: 'error',
//       title: '转换失败',
//       message: `Python 脚本不存在: ${scriptPath}`
//     })
//     return false
//   }
// }
