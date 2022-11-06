<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">{{ $t('labels.title') }}</div>
      <el-form
        :model="loginInfo"
        :rules="rules"
        ref="loginRef"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginInfo.username"
            :placeholder="$t('labels.input_placeholder')"
            @keyup.enter="submitForm(loginRef)"
          >
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            :placeholder="$t('labels.input_placeholder')"
            v-model="loginInfo.password"
            @keyup.enter="submitForm(loginRef)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="validateCode">
          <div
            style="
              display: inline-block;
              vertical-align: middle;
              width: calc(100% - 100px);
            "
          >
            <el-input
              v-model="loginInfo.validateCode"
              :placeholder="$t('labels.input_placeholder')"
              @keyup.enter="submitForm(loginRef)"
            >
              <template #prepend>
                <el-button :icon="Key"></el-button>
              </template>
            </el-input>
          </div>
          <div
            class="validate-code-wrapper"
            @click="refreshValidateCode"
            v-html="validateCodeData.img"
          ></div>
        </el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitForm(loginRef)"
            >{{ $t('labels.login') }}</el-button
          >
        </div>
        <p class="login-tips">Tips : {{ $t('labels.login_tip') }}</p>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Lock, User, Key } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../store/app'
import { getValidateCode } from '../../api/app'

const appStore = useAppStore()
const { t } = useI18n()
const loginInfo = reactive({
  username: '',
  password: '',
  validateCode: '',
})
const rules = {
  username: [
    {
      required: true,
      message: t('messages.usernameRequired'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('messages.passwordRequired'),
      trigger: 'blur',
    },
  ],
  validateCode: [
    {
      required: true,
      message: t('messages.validateCodeRequired'),
      trigger: 'blur',
    },
  ],
}
const loginRef = ref()
const validateCodeData = ref({})
const submitLoading = ref(false)

onMounted(async () => {
  refreshValidateCode()
})

const submitForm = async (formEl) => {
  try {
    submitLoading.value = true
    if (!formEl) return
    const valid = await formEl.validate()
    if (valid) {
      const { username, password, validateCode } = loginInfo
      const { key } = validateCodeData.value
      const result = await appStore.login({
        username,
        password,
        validateCode,
        validateCodeKey: key,
      })
      if (!result) {
        await refreshValidateCode()
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

const refreshValidateCode = async () => {
  try {
    const { key } = validateCodeData.value
    const res = await getValidateCode(key)
    if (res?.data) {
      validateCodeData.value = res.data
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    .ms-title {
      width: 100%;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      border-bottom: 1px solid #ddd;
    }
    .ms-content {
      padding: 30px 30px;
      .login-btn {
        text-align: center;
        button {
          width: 100%;
          height: 36px;
          margin-bottom: 10px;
        }
      }
      .login-tips {
        font-size: 12px;
        line-height: 30px;
      }
      .validate-code-wrapper {
        display: inline-block;
        vertical-align: middle;
        width: 90px;
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
        :deep svg {
          width: 90px !important;
          height: 30px !important;
          background-color: #121212;
        }
      }
    }
  }
}
</style>
