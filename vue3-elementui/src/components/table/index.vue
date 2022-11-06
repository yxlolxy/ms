<template>
  <div style="width: 100%">
    <el-table
      v-loading="tableLoading"
      :default-sort="defaultSort"
      :data="data ?? tableData"
      style="width: 100%"
      :size="small ? 'small' : 'default'"
      :max-height="maxHeight"
      :stripe="true"
      :border="true"
      :row-key="rowKey"
      :load="load"
      :tree-props="treeProps"
      :default-expand-all="defaultExpandAll"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        v-bind="column"
      >
        <template v-if="column.render" #default="data">
          <slot :name="column.render" :data="data"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPage && tableData.length"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      background
      layout="sizes, prev, pager, next, jumper"
      :total="data?.length ?? total"
      :page-sizes="[20, 40, 60, 80, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :small="small"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
const { proxy: _this } = getCurrentInstance()
const props = defineProps({
  fetchData: {
    type: Boolean,
    default: true,
  },
  data: Array,
  service: {
    type: String,
  },
  api: {
    type: String,
  },
  showPage: {
    type: Boolean,
  },
  columns: {
    type: Array,
    required: true,
  },
  query: {
    type: Object,
  },
  small: {
    type: Boolean,
  },
  sortable: {
    type: Boolean,
  },
  defaultSort: {
    // descending ascending { prop: 'createTime', order: 'ascending' }
    type: Object,
  },
  maxHeight: {
    type: Number,
    default: 500,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  lazy: {
    type: Boolean,
    default: false,
  },
  treeProps: {
    type: Object,
  },
  load: {
    type: Function,
  },
  defaultExpandAll: {
    type: Boolean,
  },
})
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const tableLoading = ref(false)
const sort = ref(props.defaultSort ?? {})

onMounted(() => {
  if (props.fetchData) {
    getTableData()
  }
})

const handleSizeChange = (size) => {
  pageSize.value = size
  getTableData()
}
const handleCurrentChange = (page) => {
  currentPage.value = page
  getTableData()
}
const handleSortChange = ({ prop, order }) => {
  // descending ascending
  sort.value = {
    prop,
    order,
  }
  getTableData()
}
const reset = () => {
  currentPage.value = 1
  pageSize.value = 20
  getTableData()
}
const getTableData = async () => {
  try {
    tableLoading.value = true
    let query = {
      ...props.query,
    }
    if (props.showPage) {
      query = {
        ...query,
        pageNum: currentPage.value,
        pageSize: pageSize.value,
      }
    }
    if (props.sortable) {
      const { prop, order } = sort.value
      if (order) {
        query = {
          ...query,
          [`${prop}Sort`]: order === 'ascending' ? 'ASC' : 'DESC',
        }
      }
    }
    const res = await _this.$api[props.service][props.api](query)
    if (res) {
      tableData.value = res.data?.list ?? []
      total.value = res.data?.total ?? 0
    }
  } catch (error) {
    console.error(error)
  } finally {
    tableLoading.value = false
  }
}

defineExpose({
  reset,
  getTableData,
})
</script>
