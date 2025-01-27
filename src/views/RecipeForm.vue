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

      <el-form-item label="Image" prop="image">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :limit="1"
          :on-exceed="handleExceed"
          accept="image/*"
          @change="handleFileChange"
          :file-list="fileList"
          list-type="picture-card"
        >
          <el-button type="primary">Select File</el-button>
        </el-upload>
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
import type {
  FormInstance,
  FormRules,
  UploadInstance,
  UploadProps,
  UploadRawFile,
} from 'element-plus'
import axios from 'axios'
import { ElMessage, genFileId } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

import config from '../config'

interface RuleForm {
  title: string
  description: string
  ingredients: string
  steps: string
  image: UploadRawFile | undefined | null
}
const upload = ref<UploadInstance>()
const fileList = reactive<any[]>([])

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
  image: undefined,
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
      if (image) {
        fileList.push({
          url: image, // S3 URL
        })
      }
    } catch (error) {
      ElMessage.error('Something went wrong, please try again later')
    }
  }
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleFileChange: UploadProps['onChange'] = (file) => {
  ruleForm.image = file.raw
}

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
