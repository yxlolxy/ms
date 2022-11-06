<template>
  <div class="tool-bar">
    <div class="collapse-btn" @click="emit('collapseChage')">
      <el-icon v-if="props.menuCollapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
    <div class="logo">{{ $t('labels.title') }}</div>
    <div class="toolbar-right">
      <el-badge is-dot class="item">
        <el-icon><Bell /></el-icon>
      </el-badge>
      <el-avatar class="user-avator" :size="30" :src="imgurl" />
      <el-dropdown class="actions" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="loginout">{{
              $t('labels.logout')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import imgurl from '../assets/img/img.jpg'
import { useAppStore } from '../store/app'
import { locale, session } from '../utils/storage'

const appStore = useAppStore()

const username = ref(appStore.user?.username)
const props = defineProps({
  menuCollapse: Boolean,
})
const emit = defineEmits(['collapseChage'])

const handleCommand = (command) => {
  if (command == 'loginout') {
    session.clear()
    locale.clear()
    location.reload()
  }
}
</script>
<style lang="less" scoped>
.tool-bar {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #242f42;
  color: white;
  font-size: 18px;
  height: 70px;
  .collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    float: left;
    padding: 0 21px;
    cursor: pointer;
  }
  .logo {
    font-size: 20px;
    float: left;
    width: 250px;
    line-height: 70px;
  }
  .toolbar-right {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    padding-right: 50px;
    .el-badge {
      display: flex;
      align-items: center;
      height: 30px;
      font-size: 22px;
    }
    .el-icon {
      cursor: pointer;
    }
    .user-avator,
    .actions {
      margin-left: 20px;
      font-size: 16px;
      .el-dropdown-link {
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
