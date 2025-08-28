<template>
  <div class="tool-list">
    <main
      class="w-[400px] h-[400px] bg-white p-[20px] rounded-[20px] absolute z-30 overflow-auto flex justify-center items-center"
    >
      <ul class="w-full h-full flex flex-col justify-center items-center gap-6">
        <li
          v-for="item in tooList"
          :key="item.name"
          class="w-4/5 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-100 to-blue-100 border border-blue-200 shadow-md text-slate-700 text-base font-semibold cursor-pointer transition-all hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-200 hover:to-sky-200"
          @click="goTool(item.path)"
        >
          {{ item.name }}
        </li>
      </ul>
    </main>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const tooList = [
  {
    name: '文件转换',
    path: '/fileTransfer'
  },
  {
    name: '文件操作',
    path: '/fileOperation'
  }
]
const router = useRouter()
const goTool = (path) => {
  router.push(path)
}
</script>

<style lang="less" scoped>
.tool-list {
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
.tool-list::before,
.tool-list::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(44px);
  opacity: 0.18;
  z-index: 0;
}
.tool-list::before {
  width: 420px;
  height: 420px;
  left: -120px;
  top: -120px;
  background: linear-gradient(135deg, #a5d8fa 0%, #dbeafe 100%);
}
.tool-list::after {
  width: 320px;
  height: 320px;
  right: -80px;
  bottom: -80px;
  background: linear-gradient(135deg, #fcd34d 0%, #f8fafc 100%);
}
</style>
