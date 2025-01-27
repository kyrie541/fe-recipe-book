<template>
  <div class="register-container">
    <h1>Register here</h1>
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="rules"
      label-width="auto"
      :size="formSize"
      status-icon
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="registerForm.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="registerForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button class="submit-button" type="primary" @click="submitForm(registerFormRef)">
          Register
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

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
}

const router = useRouter()
const authStore = useAuthStore()

const formSize = ref<ComponentSize>('default')
const registerFormRef = ref<FormInstance>()
const registerForm = reactive<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
})

const customValidation = (_: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== registerForm.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RegisterForm>>({
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Please input password',
      trigger: 'blur',
    },
  ],
  confirmPassword: [{ validator: customValidation, trigger: 'blur' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      axios
        .post(`${config.API_URL}/auth/register`, registerForm)
        .then((res) => {
          authStore.login({ token: res.data.token })
          // set token then redirect to protected page
          ElMessage({
            message: 'Register success',
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

.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
