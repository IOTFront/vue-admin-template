<template>
  <div class="userConts">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" class="el-form-conts">
          <el-form-item label="账号">
            <el-input v-model="table.param.USER_ACCOUNT" placeholder="通过账号搜索"/>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="table.param.USER_SEX" placeholder="性别选择">
              <el-option label="男" value="0"/>
              <el-option label="女" value="1"/>
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-form>
      </div>
      <div class="tableControl">
        <el-button type="success" round>新增</el-button>
        <el-button type="danger" round>批量删除</el-button>
      </div>
      <div class="tableConts">
        <el-table
          :data="table.data"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column
            fixed
            prop="USER_NAME"
            label="姓名"
            width="120"/>
          <el-table-column
            prop="USER_ACCOUNT"
            label="账号"
            width="150"/>
          <el-table-column
            prop="USER_SEX"
            label="性别"/>
          <el-table-column
            prop="USER_MOBILE"
            label="手机号码"
            width="120"/>
          <el-table-column
            prop="USER_NONLOCKED"
            label="是否锁定"/>
          <el-table-column
            prop="USER_NONEXPIRED"
            label="是否过期"/>
          <el-table-column
            prop="ORG_NAME"
            label="所属机构名称"
            width="220"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <pagination/>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList } from '@/api/userControl/table'
import pagination from '@/components/pagination'

export default {
  components: {
    pagination
  },
  data: function() {
    return {
      table: {
        data: [],
        param: {
          USER_ACCOUNT: '',
          USER_SEX: ''
        },
        selectArry: ''
      }
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    handleSearch: function() {
      this.fetchData()
    },
    handleSelectionChange: function(res) {
      console.log(res)
      this.table.selectArry = res
    },
    fetchData() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.table.data = response.data.listMapData
        this.listLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
