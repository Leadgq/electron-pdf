import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:any(.*)*',
      name: 'tooList',
      component: () => import('../views/ToolsList.vue')
    },
    {
      path: '/fileTransfer',
      name: 'fileTransfer',
      component: () => import('../views/FileTransfer.vue')
    },
    {
      path: '/fileOperation',
      name: 'fileOperation',
      component: () => import('../views/FileOperation.vue')
    }
  ]
})

export default router
