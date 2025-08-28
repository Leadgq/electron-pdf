<template>
  <main class="w-[100vw] h-[100vh] flex flex-col pl-[20px] pr-[20px] pb-[20px]">
    <div class="back flex justify-end items-center cursor-pointer h-[40px] relative">
      <Back class="cursor-pointe w-[20px] h-[20px]" @click="goBack">返回</Back>
    </div>
    <div class="flex-1 flex flex-col bg-white rounded-[10px]">
      <div class="tools border-b border-solid border-[#e5e5e5] p-[15px] pl-[20px] pr-[20px]">
        <div class="flex justify-end">
          <el-button size="small" type="success" @click="uploadFolder">上传文件夹</el-button>
          <el-button size="small" type="primary" :disabled="!folderName" @click="getPdfFile"
            >获取当前文件夹下pdf文件</el-button
          >
        <el-button @click="clearFileTableList" :disabled="fileTableList.length === 0"   size="small" type="danger">清空</el-button>
        </div>
        <div class="text-sm">文件夹路径: {{ folderName }}</div>
      </div>
      <div class="flex-1">
        <el-empty v-if="fileTableList.length === 0" description="暂无文件" :image-size="250" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { Back } from '@icon-park/vue-next/es'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessageBox ,ElMessage } from 'element-plus'

const router = useRouter()

function goBack() {
  router.back()
}

const fileTableList = ref([])
const folderName = ref('')

async function uploadFolder() {
  folderName.value = await window.api.uploadFolder()
}

async function getPdfFile() {
  const pdfList = await window.api.getPdfFile(folderName.value)
  if(pdfList.length === 0){
    ElMessage({
      message: '文件夹下没有pdf文件',
      type: 'warning',
      duration: 2000
    })
    fileTableList.value = []
    return
  }
  fileTableList.value = pdfList
}


function clearFileTableList() {
  ElMessageBox.confirm('确认清空吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    fileTableList.value = []
    folderName.value = ''
  })
}
</script>
