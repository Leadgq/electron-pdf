import { ipcMain } from 'electron'
import { spawn } from 'child_process'
import { is } from '@electron-toolkit/utils'
import { dialog } from 'electron'
import { shell } from 'electron'
import pdf2docPathAddress from '../../resources/pythonCode/pdf2doc.py?asset'
import pythonPathAddress from '../../resources/python/python-3.13.5-embed-amd64/python.exe?asset'
import pdfMergePathAddress from '../../resources/pythonCode/PdfFileMerger.py?asset'
import fs from 'fs'
import path from 'path'

const scriptPath = is.dev
  ? pdf2docPathAddress
  : pdf2docPathAddress.replace('app.asar', 'app.asar.unpacked')

const pythonPath = is.dev
  ? pythonPathAddress
  : pythonPathAddress.replace('app.asar', 'app.asar.unpacked')

const pdfMergePath = is.dev
  ? pdfMergePathAddress
  : pdfMergePathAddress.replace('app.asar', 'app.asar.unpacked')

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

ipcMain.handle('pdf-merge', async (_, pdfList) => {
  const inputPath = path.dirname(pdfList[0])
  const outPath = path.join(inputPath, 'merge.pdf')
  return new Promise((resolve, reject) => {
    const py = spawn(pythonPath, [pdfMergePath, ...pdfList, outPath])
    py.on('close', (code) => {
      if (code === 0) {
        resolve(outPath)
        // 系统弹窗
        dialog
          .showMessageBox({
            type: 'info',
            title: '合并成功',
            message: '文件已成功合并'
          })
          .then(() => {
            // 打开文件所在目录
            shell.showItemInFolder(outPath)
            // 打开文件
            shell.openPath(outPath)
          })
      } else {
        // 系统弹窗
        dialog
          .showMessageBox({
            type: 'error',
            title: '合并失败',
            message: `合并失败，退出码: ${code}`
          })
          .then(() => {
            reject(new Error(`合并失败，退出码: ${code}`))
          })
      }
    })
    py.on('error', (error) => {
      reject(new Error(`启动 Python 失败: ${error.message}`))
    })

    py.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    py.stderr.on('data', (data) => {
      console.error(data.toString())
    })
  })
})

ipcMain.handle('upload-folder', async () => {
  // 只能选择一个
  const folder = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择文件夹',
    buttonLabel: '上传',
    message: '请选择要上传的文件夹',
    // 只能选择一个文件夹
    filters: [{ name: 'Folders', extensions: ['*'] }]
  })
  if (folder.canceled) {
    return ''
  }
  return folder.filePaths[0]
})

ipcMain.handle('get-pdf-file', async (_, folderPath) => {
  // 异步读取文件
  const files = await fs.promises.readdir(folderPath)
  // 过滤出 pdf 文件
  const pdfList = files.filter((file) => file.endsWith('.pdf'))
  const pdfListInfo = pdfList.map((item) => {
    return {
      name: item,
      path: path.join(folderPath, item)
    }
  })
  return pdfListInfo
})

async function checkFileExist(pythonPath, scriptPath) {
  if (
    !(await fs.promises
      .access(pythonPath)
      .then(() => true)
      .catch(() => false))
  ) {
    dialog.showMessageBox({
      type: 'error',
      title: '转换失败',
      message: `Python 可执行文件不存在: ${pythonPath}`
    })
  }
  if (
    !(await fs.promises
      .access(scriptPath)
      .then(() => true)
      .catch(() => false))
  ) {
    dialog.showMessageBox({
      type: 'error',
      title: '转换失败',
      message: `Python 脚本不存在: ${scriptPath}`
    })
  }
}

checkFileExist(pythonPath, scriptPath)
