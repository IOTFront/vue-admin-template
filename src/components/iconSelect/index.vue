<template>
  <el-select v-model="selectIcon" :node-key="selectkey" :current-node-key="selectnode" @ filterable placeholder="请选择" @change="iconchange">
    <el-option
      v-for="item in icons"
      :key="item[selectkey]"
      :value="item">
      <span style="float: left"><svg-icon :icon-class="item" /></span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
    </el-option>
  </el-select>
</template>

<script>
import icons from './requireIcons'

export default {
// eslint-disable-next-line vue/require-prop-types
  props: ['selecticon', 'selectkey', 'selectnode'],
  data() {
    return {
      icons,
      selectIcon: this.selecticon
    }
  },
  watch: {
    selecticon: function() {
      this.selectIcon = this.selecticon
    }
  },
  methods: {
    iconchange() {
      this.$emit('iconchange', this.selectIcon)
    }
  }
}
</script>
