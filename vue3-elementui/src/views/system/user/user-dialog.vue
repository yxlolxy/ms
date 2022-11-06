<template>
  <el-dialog
    v-model="dialog.visible"
    :title="mode === 1 ? $t('labels.addUser') : $t('labels.editUser')"
    :width="800"
    :before-close="closeDialog"
    :append-to-body="true"
  >
    <el-form
      :model="dialog.data"
      :rules="rules"
      ref="formRef"
      label-width="120px"
    >
      <el-form-item prop="username" :label="$t('labels.username')">
        <el-input
          v-model="dialog.data.username"
          :placeholder="$t('labels.input_placeholder')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="roleIds" :label="$t('labels.role')">
        <el-checkbox-group v-model="dialog.data.roleIds">
          <el-checkbox
            v-for="item in roleList"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="submitLoading" @click="closeDialog">{{
          $t('labels.cancel')
        }}</el-button>
        <el-button type="primary" @click="submitDialog(formRef)">
          {{ $t('labels.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, onMounted, ref } from 'vue'
import { addUser, uptUser, getUserDetail } from '../../../api/user'
import { getRoleList } from '../../../api/role'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const rules = {
  username: [
    {
      required: true,
      message: t('messages.usernameRequired'),
      trigger: 'blur',
    },
  ],
  roleIds: [
    {
      type: 'array',
      required: true,
      message: t('messages.roleRequired'),
      trigger: 'change',
    },
  ],
}
const props = defineProps({
  mode: Number, // 1新增 2编辑
  id: Number, // 用户ID
})
const emits = defineEmits(['close'])
const loading = ref(false)
const submitLoading = ref(false)
const dialog = reactive({
  visible: true,
  data: {
    id: null,
    username: '',
    roleIds: [],
  },
})
const roleList = ref([])
const formRef = ref()

onMounted(async () => {
  try {
    loading.value = true
    const { mode } = props
    if (mode === 2) {
      const res = await getUserDetail(props.id)
      if (res?.data) {
        dialog.data = res.data
      }
    }
    const res = await getRoleList()
    if (res?.data) {
      roleList.value = res.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const closeDialog = (isCancel) => {
  dialog.visible = false
  emits('close', !!isCancel)
}
const submitDialog = async (formRef) => {
  try {
    submitLoading.value = true
    if (!formRef) return
    const valid = await formRef.validate()
    if (!valid) return
    let data = props.id
      ? {
          id: props.id,
          username: dialog.data.username,
          roleIds: dialog.data.roleIds,
        }
      : {
          username: dialog.data.username,
          roleIds: dialog.data.roleIds,
        }
    const res = props.id ? await uptUser(data) : await addUser(data)
    if (res?.data) {
      ElMessage.success(t('messages.operSucceed'))
      closeDialog(false)
    }
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}
</script>
