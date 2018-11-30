<template>
  <el-row :key="Date.parse(new Date())">
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
      @node-click="nodek">
      <div slot-scope="{ node, data }" class="left-tree-node">
        <span v-if="lefticon" class="treeIcon">
          <svg-icon :icon-class="lefticon"/>
        </span>
        <span>
          {{ node.label }}
        </span>
      </div>
    </el-tree>
  </el-row>
</template>
<script>

export default {
  name: 'LeftTree', // eslint-disable-next-line vue/require-prop-types
  props: ['searchtips', 'treedate', 'childrenstr', 'labelname', 'selectkey', 'selectnode', 'lefticon'],
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
      this.$refs.leftTree.filter(val)
    },
    treedate: function() {
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
      this.$emit('nodeclcik', obj[this.selectkey])
    }
  }

}

</script>
<style >
.left-tree-node .treeIcon{
    margin: 0 5px;
    font-size: 14px;
  }

</style>
