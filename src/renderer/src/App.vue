<script setup></script>

<template>
  <div>
    <RouterView v-slot="{ Component }">
      <component :is="Component"></component>
    </RouterView>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath === '/fileOperation') {
      window.api.setWindowSize(1000, 800)
    } else {
      window.api.setWindowSizeDefault()
    }
  }
)
</script>

<style lang="less"></style>
