<template>
  <main class="w-[100vw] h-[100vh] relative flex flex-col pl-[20px] pr-[20px]">
    <div class="back flex-1 flex justify-end items-center cursor-pointer">
      <Back class="top-4 right-4 cursor-pointe w-[20px] h-[20px]" @click="goBack">返回</Back>
    </div>
    <div class="option-top h-[46%] bg-white rounded-t-[10px] ]">
      <div class="w-full text-center text-[20px] font-bold mt-[10px]">pdf切割</div>
    </div>
    <div class="w-full h-[1px] bg-[#e5e5e5]"></div>
    <div class="option-bottom h-[46%] bg-white rounded-b-[10px]">下面</div>
  </main>
</template>

<script setup>
import { Back } from '@icon-park/vue-next/es'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>
 