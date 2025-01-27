<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Recipe Title">
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
    <el-table-column label="Actions">
      <template #default="scope">
        <el-button size="small" @click="handleCopy(scope.row)"> Add to your cookbook </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

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

interface ApiRecipe {
  name: string
  description: string
  recipeIngredient: string[]
  recipeInstructions: { text: string }[]
  image: string[]
}

const authToken = localStorage.getItem('token')

const tableData = ref<Recipe[]>([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://raw.githubusercontent.com/micahcochran/json-cookbook/refs/heads/main/cookbook-100.json',
    )
    tableData.value = data.map((recipe: ApiRecipe) => {
      const combinedIngredients = recipe.recipeIngredient.join(', ')
      const combinedSteps = Array.isArray(recipe.recipeInstructions)
        ? recipe.recipeInstructions.map((step: { text: string }) => step.text).join(' ')
        : recipe.recipeInstructions

      return {
        title: recipe.name,
        description: recipe.description,
        ingredients: combinedIngredients,
        steps: combinedSteps,
        image: Array.isArray(recipe.image) && recipe.image.length > 0 ? recipe.image[0] : null,
      }
    })
  } catch (error) {
    ElMessage.error('Something went wrong, please try again later')
  }
})

const readFileAsDataURL = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

const handleCopy = (row: Recipe) => {
  axios
    .post(`${config.API_URL}/recipes`, row, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      ElMessage({
        message: 'Recipe create success',
        type: 'success',
      })
      router.push('recipes')
    })
    .catch(() => {
      ElMessage.error('Something went wrong, please try again later')
    })
  router.push('recipes')
}
</script>

<style scoped>
.recipe-details-popover > * {
  margin-bottom: 10px;
}
</style>
