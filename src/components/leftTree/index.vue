<template>
  <el-row>
    <el-input
      :placeholder="searchtips"
      v-model="filterText"/>

    <el-tree
      ref="tree2"
      :data="treedate"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree leftTree"
      default-expand-all
      @node-click="nodek"/>
  </el-row>
</template>
<script>
export default {
  name: 'LeftTree',
  props: ['searchtips', 'treedate', 'childrenstr', 'labelname'],
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: this['childrenstr'],
        label: this['labelname']
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this['labelname']].indexOf(value) !== -1
    },
    nodek(obj, node, tree) {
      this.$emit('nodeclcik', obj.MENU_ID)
    }
  }

}

</script>
<style >

</style>
