<template>
  <el-row>
    <el-input
      :placeholder="searchtips"
      v-model="filterText"/>
    <el-tree
      ref="leftTree"
      :data="treedate"
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :highlight-current="selectH"
      :node-key="selectkey"
      class="filter-tree leftTree"
      default-expand-all
      @node-click="nodek"/>
  </el-row>
</template>
<script>
export default {
  name: 'LeftTree',
  props: ['searchtips', 'treedate', 'childrenstr', 'labelname', 'selectkey', 'selectnode'],
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: this['childrenstr'],
        label: this['labelname']
      },
      selectH: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    },
    treedate:function() {
      this.$nextTick(() => {
        this.$refs.leftTree.setCurrentKey(this.selectnode) // treeBox 元素的ref   value 绑定的node-key
      })
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
