<template>
  <div class="convert-container">
    <Back class="absolute top-4 right-4 cursor-pointer" @click="goBack">返回</Back>
    <el-card class="upload-card overflow-y-auto top-[40px] h-[430px] p-[24px]">
      <div class="upload-header">
        <div class="title w-full text-center">PDF和DOCX相互转换</div>
        <div class="btn-group flex justify-center items-center mt-2">
          <el-upload
            v-model:file-list="fileList"
            class="file-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :action="null"
            :limit="1"
            accept=".pdf,.docx"
          >
            <el-button size="small" type="primary" :disabled="fileList.length">选择文件</el-button>
          </el-upload>
        </div>
      </div>
      <div v-if="fileList.length" class="file-info flex justify-between items-center">
        <div class="flex items-center">
          <el-icon class="file-icon"><Document /></el-icon>
          <span class="file-name">{{ fileList[0].name }}</span>
        </div>
        <div
          class="text-slate-500 cursor-pointer opacity-70 hover:opacity-90 hover:scale-125 hover:text-red-500 duration-300"
          @click="clearFile"
        >
          <CloseOne theme="outline" size="12" />
        </div>
      </div>
      <div v-if="filePath" class="convert-actions">
        <div class="path-row">
          <span>文件位置:</span>
          <span class="file-path">{{ filePath }}</span>
        </div>
        <div class="mt-2">
          <el-button
            v-if="filePath.endsWith('.pdf')"
            class="mr-1"
            size="small"
            type="success"
            @click.stop="handleConvert"
            >PDF转DOCX</el-button
          >
          <el-button
            v-if="filePath.endsWith('.docx')"
            size="small"
            type="info"
            @click.stop="handleConvertDocx"
            >DOCX转PDF</el-button
          >
        </div>
      </div>
      <div v-if="docFilePath" class="result-row">
        <div class="flex items-center mb-2 mt-2">
          <el-icon class="file-icon"><DocumentChecked /></el-icon>
          <span>转换后的文件位置:</span>
        </div>
        <span class="result-path">{{ docFilePath }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Document, DocumentChecked } from '@element-plus/icons-vue'
import { CloseOne } from '@icon-park/vue-next/es'
import { Back } from '@icon-park/vue-next/es'
import { useRouter } from 'vue-router'
const router = useRouter()

const fileList = ref([])
const filePath = ref('')
const docFilePath = ref('')

watch(fileList, (newVal) => {
  if (newVal.length > 0) {
    filePath.value = newVal[0].raw?.path || ''
  }
})

function clearFile() {
  fileList.value = []
  filePath.value = ''
  docFilePath.value = ''
}

async function handleConvert() {
  docFilePath.value = await window.api.convertPdfToDocx(filePath.value)
}

async function handleConvertDocx() {
  docFilePath.value = await window.api.convertDocxToPdf(filePath.value)
}

function goBack() {
  router.back()
  clearFile()
}
</script>

<style scoped>
.convert-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 渐变背景 + 模糊效果 */
  background: linear-gradient(135deg, #f8fbff 60%, #e9f4fa 100%);
  position: relative;
  overflow: hidden;
}

/* 增加一些背景装饰元素 */
.convert-container::before,
.convert-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(44px);
  opacity: 0.18;
  z-index: 0;
}
.convert-container::before {
  width: 420px;
  height: 420px;
  left: -120px;
  top: -120px;
  background: linear-gradient(135deg, #a5d8fa 0%, #dbeafe 100%);
}
.convert-container::after {
  width: 320px;
  height: 320px;
  right: -80px;
  bottom: -80px;
  background: linear-gradient(135deg, #fcd34d 0%, #f8fafc 100%);
}

/* 卡片样式保持原有，确保内容突出 */
.upload-card {
  width: 400px;
  overflow: auto;
  background: #fff;
  box-shadow: 0 6px 32px 0 rgb(0 0 0 / 12%);
  border-radius: 18px;
  margin-top: -80px;
  position: relative;
  z-index: 1;
}

.upload-header {
  margin-bottom: 18px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.file-uploader {
  margin-right: 10px;
}

.file-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 10px;
  background: #f0f5ff;
  border-radius: 8px;
  font-size: 16px;
}

.file-icon {
  color: #3b82f6;
  margin-right: 6px;
  font-size: 20px;
}

.file-name {
  font-weight: 500;
}

.convert-actions {
  margin-bottom: 12px;
  margin-top: 10px;
}

.path-row {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #555;
}

.file-path {
  max-width: 320px;
  font-size: 13px;
  color: #999;
  word-break: break-all;
}

.result-row {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  background: #e8ffe8;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  color: #198754;
}

.result-path {
  color: #198754;
  font-size: 13px;
  word-break: break-all;
}
</style>
