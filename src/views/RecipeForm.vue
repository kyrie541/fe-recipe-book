<template>
  <div class="recipe-form-container">
    <h1>{{ formMode == 'create' ? 'Create' : 'Edit' }} Recipe</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      label-width="auto"
      class="demo-ruleForm"
      size="large"
      status-icon
    >
      <el-form-item label="Title" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input v-model="ruleForm.description" />
      </el-form-item>

      <el-form-item label="Steps" prop="steps">
        <el-input v-model="ruleForm.steps" />
      </el-form-item>

      <el-form-item label="Ingredients" prop="ingredients">
        <el-input v-model="ruleForm.ingredients" />
      </el-form-item>

      <el-form-item label="Title" prop="image">
        <el-input v-model="ruleForm.image" />
      </el-form-item>

      <el-form-item>
        <el-button class="submit-button" type="primary" @click="submitForm(ruleFormRef)">
          {{ formMode == 'create' ? 'Create' : 'Update' }}
        </el-button>
        <el-button @click="router.go(-1)">Back</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

import config from '../config'

interface RuleForm {
  title: string
  description: string
  ingredients: string
  steps: string
  image: string
}

const router = useRouter()
const route = useRoute()

const authToken = localStorage.getItem('token')

const formMode = ref<string>('create')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  title: '',
  description: '',
  ingredients: '',
  steps: '',
  image: '',
})

const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: 'Please input title', trigger: 'blur' },
    { min: 3, message: 'Min Length should be 3', trigger: 'blur' },
  ],
  description: [],
  ingredients: [],
  steps: [],
  image: [],
})

onMounted(async () => {
  if (route.query.id) {
    formMode.value = 'edit'
    try {
      const response = await axios.get(`${config.API_URL}/recipes/${route.query.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      const { title, description, steps, ingredients, image } = response.data
      ruleForm.title = title
      ruleForm.description = description
      ruleForm.steps = steps
      ruleForm.ingredients = ingredients
      ruleForm.image = image
    } catch (error) {
      ElMessage.error('Something went wrong, please try again later')
    }
  }
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (formMode.value === 'create') {
        createRecipe()
      } else {
        updateRecipe()
      }
    }
  })
}

const createRecipe = () => {
  axios
    .post(`${config.API_URL}/recipes`, ruleForm, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      ElMessage({
        message: 'Recipes create success',
        type: 'success',
      })
      router.push('recipes')
    })
    .catch(() => {
      ElMessage.error('Something went wrong, please try again later')
    })
}

const updateRecipe = () => {
  axios
    .put(`${config.API_URL}/recipes/${route.query.id}`, ruleForm, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      ElMessage({
        message: 'Recipes update success',
        type: 'success',
      })
      router.push('recipes')
    })
    .catch(() => {
      ElMessage.error('Something went wrong, please try again later')
    })
}
</script>

<style scoped>
.submit-button {
  margin: 0 auto;
  display: block;
}

.recipe-form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
