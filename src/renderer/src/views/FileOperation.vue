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
          <el-button
            :disabled="fileTableList.length === 0"
            size="small"
            type="danger"
            @click="clearFileTableList"
            >清空</el-button
          >
        </div>
        <div class="text-sm flex items-center flex-wrap">
          文件夹路径: {{ folderName }}
          <CloseOne
            v-if="folderName"
            class="text-red-600 ml-[5px]"
            @click="folderName = ''"
          ></CloseOne>
        </div>
      </div>
      <section class="mt-[20px] mb-[10px]">
        <div class="pl-[20px] mb-[10px]">
          <el-button
            type="primary"
            size="small"
            :disabled="fileTableList.length === 0"
            @click="mergePdf"
            >合并pdf</el-button
          >
        </div>
      </section>
      <div class="flex-1 overflow-auto">
        <el-table
          :data="fileTableList"
          style="width: 100%"
          row-key="path"
          :tree-props="treeProps"
          @selection-change="handleSelectionChange"
        >
          <template #empty>
            <el-empty description="暂无文件" :image-size="100" />
          </template>
          <el-table-column type="selection" width="55" :selectable="() => true" />
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="path" label="文件路径" align="left" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button size="small" type="danger" @click="deleteFile(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { Back, CloseOne } from '@icon-park/vue-next/es'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

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
  if (pdfList.length === 0) {
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

const treeProps = reactive({
  checkStrictly: false
})

const selectPath = ref([])
function handleSelectionChange(selectRowArr) {
  selectPath.value = selectRowArr
}

function deleteFile(row) {
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const itemIndex = fileTableList.value.findIndex((item) => item.path === row.path)
    if (itemIndex !== -1) {
      fileTableList.value.splice(itemIndex, 1)
    }
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000,
      showClose: true
    })
  })
}
</script>
