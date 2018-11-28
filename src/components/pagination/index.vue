<template>
  <div class="pagination">
    <el-pagination
      :current-page="pager"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagesize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>
<script>
export default {
  props: ['total', 'pagesize', 'pager'],
  data() {
    return {}
  },
  methods: {
    handleSizeChange(val) { // 每页显示数量改变
      this.$emit('pagersizechange', val)
    },
    handleCurrentChange(val) { // 页码改变
      this.$emit('pagerchange', val)
    }
  }
}
</script>
<style>
  .pagination{
    padding-top: 20px;
  }
</style>
