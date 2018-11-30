<template>
  <div class="dashboard-container">
    <h1 style="margin: 100px;text-align: center;color: #304156">图腾框架</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
