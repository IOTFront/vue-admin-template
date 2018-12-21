<template>
  <div class="homePage">
    <h1 style="margin: 100px;">图腾框架</h1>
    <div><img :src="imgurl" alt=""></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Homepage',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data: function() {
    return {
      imgurl: '/static/logAndTitle.png'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.homePage{
  background:#304156;
  padding: 20px 60px 60px;
  color:#fff ;
  text-align: center;
  margin: 100px auto;
  width: 60%;
}
</style>
