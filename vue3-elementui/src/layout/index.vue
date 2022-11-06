<template>
  <el-container class="layout-container">
    <el-header>
      <ToolBar
        @collapseChage="toggleMenuCollapse"
        :menuCollapse="menuCollapse"
      />
    </el-header>
    <el-container style="height: 0">
      <el-aside :width="menuCollapse ? 'auto' : '250px'">
        <AsideMenu :menuCollapse="menuCollapse" />
      </el-aside>
      <div class="content-box">
        <el-breadcrumb :separator-icon="ArrowRight" style="margin: 10px 0">
          <el-breadcrumb-item :to="{ name: HOMEROUTENAME }">
            <div class="breadcrumb-item" style="cursor: pointer">
              <el-icon><HomeFilled /></el-icon> &nbsp;{{
                $t('labels.homepage')
              }}
            </div>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in appStore.routePathArr"
            :key="index"
          >
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <TabBar />
        <el-main style="height: 100%">
          <el-scrollbar>
            <router-view v-slot="{ Component }">
              <keep-alive :exclude="appStore.excludeKeepAlive">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </el-scrollbar>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AsideMenu from './aside-menu.vue'
import ToolBar from './tool-bar.vue'
import TabBar from './tab-bar.vue'
import { HOMEROUTENAME } from '../router'
import { useAppStore } from '../store/app'
import { ArrowRight } from '@element-plus/icons-vue'

const appStore = useAppStore()
const menuCollapse = ref(false)
const toggleMenuCollapse = () => {
  menuCollapse.value = !menuCollapse.value
}
</script>
<style lang="less" scoped>
.layout-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-header {
    height: 70px;
    padding: 0;
  }
  .content-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    padding: 10px 15px;
    overflow: hidden;
  }
  .breadcrumb-item {
    display: flex;
    align-items: center;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
