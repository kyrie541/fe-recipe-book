<template>
  <el-button @click="handleCreate" type="primary">Create new Recipe</el-button>
  <el-divider />
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Created Date" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{
            new Date(scope.row.createdAt).toLocaleString()
          }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Recipe Title" width="180">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>Title: {{ scope.row.title }}</div>
            <div>Description: {{ scope.row.Description }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.title }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="Actions">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)"> Edit </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)"> Delete </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination layout="prev, pager, next" :total="80" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Timer } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

import config from '../config'

const router = useRouter()

interface Recipes {
  id: number
  title: string
  description: string
  ingredients: string
  steps: string
  image: string
}

const tableData = ref<Recipes[]>([])

const authToken = localStorage.getItem('token')

onMounted(async () => {
  try {
    const response = await axios.get(`${config.API_URL}/recipes`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    tableData.value = response.data.recipes
  } catch (error) {
    ElMessage.error('Something went wrong, please try again later')
  }
})

const handleCreate = () => {
  router.push('recipe-form')
}

const handleEdit = (row: Recipes) => {
  router.push({ name: 'recipe-form', query: { id: row.id } })
}
const handleDelete = (row: Recipes) => {
  ElMessageBox.confirm(`Are you sure to delete ${row.title}?`, 'Confirm', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
    center: true,
  })
    .then(async () => {
      try {
        await axios.delete(`${config.API_URL}/recipes/${row.id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        ElMessage({
          type: 'success',
          message: 'Delete completed',
        })

        location.reload()
      } catch (error) {
        ElMessage.error('Something went wrong, please try again later')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>
