<template>
  <div class="content user">
    <el-row :gutter="16">
      <el-col :span="4">
        <el-input
          v-model="query.username"
          :placeholder="$t('labels.input_placeholder')"
          @keyup.enter="search"
        >
          <template #prepend>{{ $t('labels.username') }}</template>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="14" style="text-align: right">
        <el-button type="primary" @click="search">{{
          $t('labels.search')
        }}</el-button>
        <el-button style="margin-left: 16px" @click="reset">{{
          $t('labels.reset')
        }}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="4" v-if="$authorize($route.name, 'add')"
        ><el-button @click="openUserDialog(null, 1)" type="primary">{{
          $t('labels.add')
        }}</el-button></el-col
      >
    </el-row>
    <Table
      ref="tableRef"
      style="margin-top: 16px"
      service="user"
      api="getUserList"
      :defaultSort="{ prop: 'createTime', order: 'ascending' }"
      :sortable="true"
      :showPage="true"
      :columns="columns"
      :query="query"
    >
      <template #actions="{ data }">
        <el-button
          v-if="$authorize($route.name, 'edit')"
          @click="openUserDialog(data, 2)"
          type="primary"
          :icon="Edit"
          size="large"
          link
        ></el-button>
        <el-popconfirm
          :title="$t('messages.confirmDelete')"
          @confirm="deleteUser(data)"
        >
          <template #reference>
            <el-button
              v-if="$authorize($route.name, 'delete')"
              style="margin-left: 16px"
              type="danger"
              :icon="Delete"
              size="large"
              link
            ></el-button>
          </template>
        </el-popconfirm>
      </template>
    </Table>
    <user-dialog
      :mode="dialog.mode"
      :id="dialog.id"
      v-if="dialog.visible"
      @close="closeUserDialog"
    ></user-dialog>
  </div>
</template>
<script setup>
import Table from '../../../components/table/index.vue'
import moment from 'moment'
import { reactive, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import UserDialog from './user-dialog.vue'
import { useI18n } from 'vue-i18n'
import { delUser } from '../../../api/user'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const dialog = reactive({
  visible: false,
  mode: 1, // 1 新增 2 编辑
  id: null,
})
const columns = [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
  },
  {
    prop: 'username',
    label: t('labels.username'),
    align: 'center',
  },
  {
    prop: 'createTime',
    label: t('labels.createTime'),
    align: 'center',
    formatter: (row) => {
      return moment(row.createTime).format('YYYY-MM-DD hh:mm:SS')
    },
    sortable: 'custom',
  },
  {
    prop: 'updateTime',
    label: t('labels.updateTime'),
    align: 'center',
    formatter: (row) => {
      return moment(row.updateTime).format('YYYY-MM-DD hh:mm:SS')
    },
  },
  {
    prop: 'actions',
    label: t('labels.actions'),
    align: 'center',
    fixed: 'right',
    render: 'actions',
  },
]
const tableRef = ref(null)
const query = reactive({
  username: '',
})

const search = () => {
  tableRef.value?.getTableData()
}
const reset = () => {
  query.username = ''
  tableRef.value?.reset()
}
const openUserDialog = (data, mode) => {
  dialog.mode = mode
  if (data) {
    dialog.id = data.row.id
  } else {
    dialog.id = null
  }
  dialog.visible = true
}
const closeUserDialog = (isCancel) => {
  dialog.visible = false
  dialog.mode = 1
  dialog.id = null
  if (!isCancel) {
    tableRef.value?.getTableData()
  }
}
const deleteUser = async (data) => {
  const id = data.row.id
  const res = await delUser(id)
  if (res?.data) {
    ElMessage.success(t('messages.operSucceed'))
    tableRef.value?.getTableData()
  }
}
</script>
