<template>
  <el-container class="aside-menu">
    <el-main>
      <el-scrollbar>
        <el-menu
          :default-active="HOMEROUTENAME"
          :collapse="props.menuCollapse"
          background-color="#324157"
          text-color="#bfcbd9"
          active-text-color="#20a0ff"
          @select="handleMenuItemClick"
        >
          <template v-for="item in appStore.menus">
            <template v-if="item.children">
              <el-sub-menu
                v-if="!item?.meta?.hide"
                :index="item.name"
                :key="item.name"
                :class="{
                  active: appStore.curRouteName === item.name,
                  deactive: appStore.curRouteName !== item.name,
                }"
              >
                <template #title>
                  <el-icon v-if="!!item?.meta?.icon">
                    <component :is="item.meta.icon"></component>
                  </el-icon>
                  <span class="menu-title-ellipsis">{{
                    item?.meta?.title ?? '未命名'
                  }}</span>
                </template>
                <template v-for="subItem in item.children">
                  <el-sub-menu
                    v-if="subItem.children && !subItem?.meta?.hide"
                    :index="subItem.name"
                    :key="subItem.name"
                    :class="{
                      active: appStore.curRouteName === subItem.name,
                      deactive: appStore.curRouteName !== subItem.name,
                    }"
                  >
                    <template #title
                      ><span class="menu-title-ellipsis">{{
                        subItem?.meta?.title ?? '未命名'
                      }}</span></template
                    >
                    <template v-for="(threeItem, i) in subItem.children">
                      <el-menu-item
                        v-if="!threeItem?.meta?.hide"
                        :key="i"
                        :index="threeItem.name"
                        :class="{
                          active: appStore.curRouteName === threeItem.name,
                          deactive: appStore.curRouteName !== threeItem.name,
                        }"
                      >
                        <span class="menu-title-ellipsis">{{
                          threeItem?.meta?.title ?? '未命名'
                        }}</span>
                      </el-menu-item>
                    </template>
                  </el-sub-menu>
                  <el-menu-item
                    v-else-if="!subItem?.meta?.hide"
                    :index="subItem.name"
                    :key="subItem.name"
                    :class="{
                      active: appStore.curRouteName === subItem.name,
                      deactive: appStore.curRouteName !== subItem.name,
                    }"
                  >
                    <span class="menu-title-ellipsis">{{
                      subItem?.meta?.title ?? '未命名'
                    }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item
                v-if="!item?.meta?.hide"
                :index="item.name"
                :key="item.name"
                :class="{
                  active: appStore.curRouteName === item.name,
                  deactive: appStore.curRouteName !== item.name,
                }"
              >
                <el-icon v-if="!!item?.meta?.icon">
                  <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title
                  ><span class="menu-title-ellipsis">{{
                    item?.meta?.title ?? '未命名'
                  }}</span></template
                >
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script setup>
import { useAppStore } from '../store/app'
import { HOMEROUTENAME } from '../router'
import { useRouter } from 'vue-router'
import { getRouteByCache } from '../utils/router'

const router = useRouter()
const appStore = useAppStore()
const props = defineProps({
  menuCollapse: Boolean,
})

const handleMenuItemClick = (index) => {
  const { curRouteName } = appStore
  if (curRouteName === index) return
  const { tabs } = appStore
  const route = getRouteByCache(index)
  if (!tabs.find((item) => item.name === index) && index !== HOMEROUTENAME) {
    appStore.setTabs([
      ...tabs,
      {
        name: route.name,
        title: route.title,
      },
    ])
  }
  router.push({
    name: index,
  })
}
</script>
<style lang="less" scoped>
.aside-menu {
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  .el-main {
    padding: 0;
    background-color: #324157;
  }
  .el-menu {
    border-right: none;
  }
  .menu-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .menu-title-ellipsis {
    display: inline-block;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-menu-item {
    &.active > span {
      color: var(--el-menu-active-color) !important;
    }
    &.deactive > span {
      color: var(--el-menu-text-color) !important;
    }
  }
}
</style>
