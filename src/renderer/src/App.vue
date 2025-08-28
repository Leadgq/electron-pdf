<script setup></script>

<template>
  <div>
    <RouterView v-slot="{ Component }">
      <component :is="Component"></component>
    </RouterView>
  </div>
</template>

<style lang="less"></style>
