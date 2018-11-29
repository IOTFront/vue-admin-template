<template>
  <el-select v-model="selectValue" filterable placeholder="请选择" @change="iconchange">
    <el-option
      v-for="item in icons"
      :key="item+'iconSelect'"
      :value="item">
      <span style="float: left"><svg-icon :icon-class="item" /></span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
    </el-option>
  </el-select>
</template>

<script>
import icons from './requireIcons'

export default {
  props: ['selecticon'],
  data() {
    return {
      icons,
      selectValue: this.selecticon,
      value6: ''
    }
  },
  methods: {
    iconchange() {
      this.$emit('iconchange', this.selectValue)
    }
  }
}
</script>
