<template>
  <el-button @click="handleCreate" type="primary">Create new Recipe</el-button>
  <el-divider />
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Created Date" width="250">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{
            new Date(scope.row.createdAt).toLocaleString()
          }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Recipe Title" width="500">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div class="recipe-details-popover">
              <div>Title: {{ scope.row.title }}</div>
              <div>Description: {{ scope.row.description }}</div>
              <div>Ingredients: {{ scope.row.ingredients }}</div>
              <div>Steps: {{ scope.row.steps }}</div>
              <el-image
                v-if="scope.row.image"
                style="width: 100px; height: 100px"
                :src="scope.row.image"
              />
            </div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.title }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="Actions" width="300">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)"> Edit </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)"> Delete </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    layout="prev, pager, next"
    :total="totalRecipes"
    :default-page-size="pageSize"
    @change="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Timer } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

import config from '../config'

const router = useRouter()

interface Recipe {
  id: number
  title: string
  description: string
  ingredients: string
  steps: string
  image: string
}

const tableData = ref<Recipe[]>([])
const totalRecipes = ref<number>(0)

const authToken = localStorage.getItem('token')

onMounted(async () => {
  fetchRecipes(1)
})

const pageSize = 10

const fetchRecipes = async (page: number) => {
  try {
    const response = await axios.get(`${config.API_URL}/recipes?limit=${pageSize}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    tableData.value = response.data.recipes
    totalRecipes.value = response.data.total
  } catch (error) {
    ElMessage.error('Something went wrong, please try again later')
  }
}

const handlePageChange = (currentPage: number, pageSize: number) => {
  fetchRecipes(currentPage)
}

const handleCreate = () => {
  router.push('recipe-form')
}

const handleEdit = (row: Recipe) => {
  router.push({ name: 'recipe-form', query: { id: row.id } })
}
const handleDelete = (row: Recipe) => {
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

<style scoped>
.recipe-details-popover > * {
  margin-bottom: 10px;
}
</style>
