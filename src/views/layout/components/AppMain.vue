<template>
  <section class="app-main">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-row
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF">
        <transition name="fade-transform" mode="out-in">
          <!-- or name="fade" -->
          <!-- <router-view :key="key"></router-view> -->
          <router-view/>

        </transition>
      </el-row>

    </el-scrollbar>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './Sidebar/SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>
  .app-main {
    height: calc(100vh - 111px);
    position: relative;
  }
</style>
