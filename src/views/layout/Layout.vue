<template>
  <div class="appOuterAllCont">
    <div class="appTopBanner">
      <div class="rightCOnts">
        <img src="src/assets/tt.jpg" alt="">
        <span>图腾框架</span>
      </div>

    </div>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <sidebar class="sidebar-container"/>
      <div class="main-container">
        <navbar/>
        <app-main/>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .appTopBanner{
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background: #304156;
    border-bottom: 1px solid rgba(28, 146, 34, 0.6);
    .rightCOnts{
      display: inline-block;
      padding: 5px 20px;
      img{
        width: 40px;
        height: 40px;
        border-radius: 2px;
      }
      span{
        display: inline-block;
        position: absolute;
        top:5px;
        height:40px;
        line-height: 40px;
        left: 70px;
        font-size: 18px;
        color: #fff;
      }
    }
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
