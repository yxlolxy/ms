<template>
  <el-dialog
    v-model="dialog.visible"
    :title="mode === 1 ? $t('labels.addRole') : $t('labels.editRole')"
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
      <el-form-item prop="name" :label="$t('labels.name')">
        <el-input
          v-model="dialog.data.name"
          :placeholder="$t('labels.input_placeholder')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="permissionIds" :label="$t('labels.menu')">
        <el-tree-select
          v-model="dialog.data.permissionIds"
          :data="menuTree"
          multiple
          :render-after-expand="false"
          :placeholder="$t('labels.select_placeholder')"
          show-checkbox
        />
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
import { addRole, uptRole, getRoleDetail } from '../../../api/role'
import { getMenus } from '../../../api/menu'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const rules = {
  name: [
    {
      required: true,
      message: t('messages.nameRequired'),
      trigger: 'blur',
    },
  ],
  permissionIds: [
    {
      type: 'array',
      required: true,
      message: t('messages.menuRequired'),
      trigger: 'change',
    },
  ],
}
const props = defineProps({
  mode: Number, // 1新增 2编辑
  id: Number, // 角色ID
})
const emits = defineEmits(['close'])
const loading = ref(false)
const submitLoading = ref(false)
const dialog = reactive({
  visible: true,
  data: {
    id: null,
    name: '',
    permissionIds: [],
  },
})
const menuTree = ref([])
const formRef = ref()

onMounted(async () => {
  try {
    loading.value = true
    const { mode } = props
    if (mode === 2) {
      const res = await getRoleDetail(props.id)
      if (res?.data) {
        dialog.data = res.data
      }
    }
    const res = await getMenus()
    if (res?.data) {
      const list = (res?.data ?? []).filter((item) => !item.isPage)
      const map = list.reduce((acc, cur) => {
        cur.value = cur.id
        cur.label = cur.title
        return { ...acc, [cur.id]: cur }
      }, {})
      list.forEach((item) => {
        if (item.pId) {
          const parent = map[item.pId]
          if (parent?.children) {
            parent.children.push(item)
          } else {
            parent.children = [item]
          }
        }
      })
      menuTree.value = list.filter((item) => !item.pId)
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
    const { mode, id } = props
    let data =
      mode === 2
        ? {
            id,
            name: dialog.data.name,
            permissionIds: dialog.data.permissionIds,
          }
        : {
            name: dialog.data.name,
            permissionIds: dialog.data.permissionIds,
          }
    const res = props.id ? await uptRole(data) : await addRole(data)
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
