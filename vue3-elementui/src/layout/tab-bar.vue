<template>
  <div class="tab-bar">
    <el-tabs
      :modelValue="appStore.curRouteName"
      type="card"
      @tab-remove="removeTab"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="item in appStore.tabs"
        :key="item.name"
        :name="item.name"
        :closable="item.name !== HOMEROUTENAME"
      >
        <template #label>
          <el-dropdown
            trigger="contextmenu"
            :id="item.name"
            ref="menuDropdownRef"
            @visible-change="handleDropdownChange($event, item.name)"
            @command="handleCommand($event, item.name)"
          >
            <span class="tab-title">{{ item.title }}</span>
            <template #dropdown v-if="item.name !== HOMEROUTENAME">
              <el-dropdown-menu>
                <el-dropdown-item command="closeCur">关闭当前</el-dropdown-item>
                <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../store/app'
import { HOMEROUTENAME } from '../router'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuDropdownRef = ref()
const appStore = useAppStore()

// const addTab = (name, title, query, params) => {
//   const { tabs } = appStore
//   appStore.setTabs([
//     ...tabs,
//     {
//       name, title, query, params,
//     }
//   ])
// }
const changeRoute = (route) => {
  const { name, query, params } = route
  router.push(name, query, params)
}
const tabClick = ({ index }) => {
  const { tabs, curRouteName } = appStore
  if (tabs[index].name === curRouteName) return
  changeRoute(tabs[index])
}
const removeTab = (name) => {
  const { tabs, curRouteName } = appStore
  if (curRouteName === name) {
    tabs.forEach((tab, index) => {
      if (tab.name === name) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          changeRoute(nextTab)
        }
      }
    })
  }
  appStore.tabs = tabs.filter((tab) => tab.name !== name)
}

const handleCommand = (command, name) => {
  if (command === 'closeAll') {
    removeAllTabs()
  } else if (command === 'closeCur') {
    removeTab(name)
  }
}

const removeAllTabs = () => {
  const { tabs } = appStore
  const homeRoute = tabs[0]
  appStore.tabs = [homeRoute]
  changeRoute(homeRoute)
}

const handleDropdownChange = (visible, name) => {
  if (!visible) return
  menuDropdownRef.value.forEach((item) => {
    if (item.id === name) return
    item.handleClose()
  })
}
</script>

<style lang="less" scoped>
.tab-bar {
  width: 100%;
  height: 30px;
  margin: 10px 0;
  user-select: none;

  //   --el-dropdown-menuItem-hover-color: var(--el-color-primary);
  :deep(.el-tabs__header) {
    --el-tabs-header-height: 30px;
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: var(--el-tabs-header-height);
    }
    .el-tabs__item {
      margin-right: 5px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: #dedede;
      &.is-active {
        color: white;
        background-color: var(--el-color-primary);
        .tab-title {
          color: white;
          &:hover {
            color: white;
          }
        }
      }
      .tab-title {
        display: inline-block;
        height: 100%;
        line-height: var(--el-tabs-header-height);
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
