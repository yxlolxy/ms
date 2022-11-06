<template>
  <div class="content menu">
    <el-row :gutter="16">
      <el-col :span="4">
        <el-input
          v-model="query.title"
          :placeholder="$t('labels.input_placeholder')"
          @keyup.enter="getTableData"
        >
          <template #prepend>{{ $t('labels.role') }}</template>
        </el-input>
      </el-col>
      <el-col :span="6" :offset="14" style="text-align: right">
        <el-button type="primary" @click="getTableData">{{
          $t('labels.search')
        }}</el-button>
        <el-button style="margin-left: 16px" @click="getTableData(true)">{{
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
      :columns="columns"
      :fetchData="false"
      :data="tableData"
      v-loading="tableLoading"
    >
      <template #actions="{ data }">
        <el-button
          v-if="$authorize($route.name, 'add') && !data?.row?.isPage"
          @click="openUserDialog(data, 1)"
          type="primary"
          :icon="CirclePlus"
          size="large"
          link
        ></el-button>
        <el-button
          v-if="$authorize($route.name, 'edit')"
          style="margin-left: 16px"
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
    <menu-dialog
      :mode="dialog.mode"
      :data="dialog.data"
      v-if="dialog.visible"
      @close="closeUserDialog"
    ></menu-dialog>
  </div>
</template>
<script setup>
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { delMenu, getMenus } from '../../../api/menu'
import Table from '../../../components/table/index.vue'
import MenuDialog from './menu-dialog.vue'

const { t } = useI18n()
const dialog = reactive({
  visible: false,
  mode: 1, // 1 新增 2 编辑
  data: null,
})
const columns = [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
  },
  {
    prop: 'pId',
    label: 'PID',
    align: 'center',
  },
  {
    prop: 'title',
    label: t('labels.label'),
    align: 'center',
  },
  {
    prop: 'name',
    label: t('labels.name'),
    align: 'center',
  },
  {
    prop: 'isPage',
    label: t('labels.pageMenu'),
    align: 'center',
    formatter: (row) => {
      return row.isPage ? '是' : '否'
    },
  },
  {
    prop: 'createTime',
    label: t('labels.createTime'),
    align: 'center',
    formatter: (row) => {
      return moment(row.createTime).format('YYYY-MM-DD hh:mm:SS')
    },
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
const menus = ref([])
const tableRef = ref(null)
const tableData = ref([])
const tableLoading = ref(false)
const query = reactive({
  title: '',
})

onMounted(() => {
  getTableData()
})

const getTableData = async (isReset) => {
  try {
    tableLoading.value = true
    const res = await getMenus()
    const data = res?.data ?? []
    menus.value = data
    if (isReset === true) query.title = ''
    const list = JSON.parse(JSON.stringify(menus.value)).filter((item) =>
      item.title.includes(query.title),
    )
    const map = list.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    list.forEach((item) => {
      if (item.pId) {
        const parent = map[item.pId]
        if (parent?.children) {
          parent.children.push(item)
        } else if (!parent) {
          item.isRoot = true
        } else {
          parent.children = [item]
        }
      } else {
        item.isRoot = true
      }
    })
    tableData.value = list.filter((item) => item.isRoot)
  } catch (error) {
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}
const openUserDialog = (data, mode) => {
  dialog.mode = mode
  if (data) {
    if (mode === 1) {
      dialog.data = {
        id: null,
        name: '',
        titlte: '',
        isPage: false,
        pId: data.row.id,
      }
    } else {
      const { id, name, title, isPage, pId } = data.row
      dialog.data = { id, name, title, isPage, pId }
    }
  } else {
    dialog.data = {
      id: null,
      name: '',
      titlte: '',
      isPage: false,
      pId: null,
    }
  }
  dialog.visible = true
}
const closeUserDialog = (isCancel) => {
  dialog.visible = false
  dialog.mode = 1
  dialog.id = null
  if (!isCancel) {
    getTableData(true)
  }
}
const deleteUser = async (data) => {
  const id = data.row.id
  const res = await delMenu(id)
  if (res?.data) {
    ElMessage.success(t('messages.operSucceed'))
    getTableData(true)
  }
}
</script>
