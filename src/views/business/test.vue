<template>
  <div>
    <div class="block">
      <span class="demonstration">默认</span>
      <el-date-picker
        v-model="value1"
        type="datetime"
        placeholder="选择日期时间"/>
    </div>
    <div class="block">
      <span class="demonstration">带快捷选项</span>
      <el-date-picker
        v-model="value2"
        :picker-options="pickerOptions1"
        type="datetime"
        placeholder="选择日期时间"
        align="right"/>
    </div>
    <div class="block">
      <span class="demonstration">设置默认时间</span>
      <el-date-picker
        v-model="value3"
        type="datetime"
        placeholder="选择日期时间"
        default-time="12:00:00"/>
    </div>
    <div id="app">
      <calendar height="800px" width="800px"/>
    </div>
  </div>
</template>

<script>
import Calendar from 'himmas-vue-calendar'

export default {
  components: { Calendar },
  data() {
    return {
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value1: '',
      value2: '',
      value3: ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
