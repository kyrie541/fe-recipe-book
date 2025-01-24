<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'

import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleSelect = (key: string, keyPath: string[]) => {
  // redirect with vue-router by using switch case
  if (key == '1') {
    router.push({ path: '/' })
  } else if (key == '2') {
    router.push({ path: '/register' })
  } else if (key == '3') {
    router.push({ path: '/recipes' })
  } else if (key == '4') {
    router.push({ path: '/public-recipes' })
  } else if (key == '5') {
    authStore.logout()
    router.push({ path: '/' })
  }
}
</script>

<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
        <el-menu-item index="0">Recipe Cookbook</el-menu-item>
        <el-menu-item v-if="!authStore.isAuthenticated" index="1"> Login </el-menu-item>
        <el-menu-item v-if="!authStore.isAuthenticated" index="2"> Register </el-menu-item>
        <el-menu-item v-if="authStore.isAuthenticated" index="3"> Your Cookbook </el-menu-item>
        <el-menu-item v-if="authStore.isAuthenticated" index="4"> Public Recipes </el-menu-item>
        <el-menu-item v-if="authStore.isAuthenticated" index="5"> Logout </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
