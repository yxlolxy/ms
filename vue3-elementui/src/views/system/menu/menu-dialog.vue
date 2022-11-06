<template>
  <el-dialog
    v-model="dialog.visible"
    :title="mode === 1 ? $t('labels.addMenu') : $t('labels.editMenu')"
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
      <el-form-item prop="title" :label="$t('labels.label')">
        <el-input
          v-model="dialog.data.title"
          :placeholder="$t('labels.input_placeholder')"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('labels.parent')">
        <el-tree-select
          v-model="dialog.data.pId"
          :data="menuTree"
          check-strictly
          :render-after-expand="false"
          :placeholder="$t('labels.select_placeholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('labels.pageMenu')">
        <el-switch v-model="dialog.data.isPage" />
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
import { reactive, onMounted, ref, nextTick } from 'vue'
import { getMenus, addMenu, uptMenu } from '../../../api/menu'
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
    {
      pattern: /^[a-zA-Z]+$/,
      message: t('messages.nameLettersOnly'),
      trigger: 'blur',
    },
  ],
  title: [
    {
      required: true,
      message: t('messages.labelRequired'),
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
      message: t('messages.labelLettersOnly'),
      trigger: 'blur',
    },
  ],
}
const props = defineProps({
  mode: Number, // 1新增 2编辑
  data: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emits = defineEmits(['close'])
const submitLoading = ref(false)
const dialog = reactive({
  visible: true,
  data: {
    id: null,
    pId: null,
    name: '',
    title: '',
    isPage: false,
  },
})
const menuTree = ref([])
const formRef = ref()

onMounted(async () => {
  try {
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
    const { data } = props
    nextTick(() => {
      dialog.data = data
    })
  } catch (error) {
    console.error(error)
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
    let { data, mode } = dialog
    const res = mode === 1 ? await addMenu(data) : await uptMenu(data)
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
