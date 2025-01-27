<template>
  <div class="login-container">
    <h1>Login here</h1>
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="auto"
      :size="formSize"
      status-icon
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="loginForm.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="loginForm.password" type="password" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button class="submit-button" type="primary" @click="submitForm(loginFormRef)">
          Login
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

import config from '../config'
import { useAuthStore } from '../stores/auth'

interface LoginForm {
  email: string
  password: string
}

const router = useRouter()
const authStore = useAuthStore()

const formSize = ref<ComponentSize>('default')
const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
})

const rules = reactive<FormRules<LoginForm>>({
  email: [{ required: true, message: 'Please input email', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: 'Please input password',
      trigger: 'blur',
    },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      axios
        .post(`${config.API_URL}/auth/login`, loginForm)
        .then((res) => {
          authStore.login({ token: res.data.access_token })
          // set token then redirect to protected page
          ElMessage({
            message: 'Login success',
            type: 'success',
          })
          router.push('recipes')
        })
        .catch(() => {
          ElMessage.error('Something went wrong, please try again later')
        })
    }
  })
}
</script>

<style scoped>
.submit-button {
  margin: 0 auto;
  display: block;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
