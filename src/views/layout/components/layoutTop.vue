<template>
  <div class="right-menu">
    <template v-if="device!=='mobile'">

      <el-tooltip :content="fullScreen" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item"/>
      </el-tooltip>

    </template>

    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <el-tooltip :content="users.userAccount" effect="dark" placement="bottom">
          <img :src="users.userPhoto?users.userPhoto:'/static/default.gif'" class="user-avatar">
        </el-tooltip>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            回到首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Screenfull
  },
  data: () => {
    return {
      fullScreen: '全屏'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'users',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .right-menu {
    float: right;
    height: 100%;
    padding-top: 5px;
    &:focus{
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>

