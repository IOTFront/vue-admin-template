<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" class="el-form-conts">
          <el-form-item label="账号">
            <el-input v-model="table.param.userAccount" placeholder="通过账号搜索"/>
          </el-form-item>
          <el-form-item label="用户是否锁定">
            <el-select v-model="table.param.userNonlocked" placeholder="请选择">
              <el-option label="未锁定" value="0"/>
              <el-option label="已锁定" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="用户是否过期">
            <el-select v-model="table.param.userNonlocked" placeholder="请选择">
              <el-option label="未过期" value="0"/>
              <el-option label="已过期" value="1"/>
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-form>
      </div>
      <div class="tableControl">
        <el-button type="success" round @click="addUser">新增</el-button>
        <el-button type="danger" round>批量删除</el-button>
      </div>
      <div v-loading="tableLoading" class="tableConts">
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
            width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <pagination
            :total="table.count"
            :pager="table.param.index"
            :pagesize="table.param.size"
            @pagersizechange="pagerSizeChange"
            @pagerchange="pagerChange"/>
        </div>
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
          userAccount: '',
          userNonlocked: '',
          userNonexpired: '',
          orgId: '',
          roleId: '',
          index: 1,
          size: 10
        },
        count: 0,
        selectArry: ''
      },
      tableLoading: true
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
      this.tableLoading = false
      this.fetchData()
    },
    handleSelectionChange: function(res) {
      this.table.selectArry = res
    },
    pagerChange: function(pager) {
      this.table.param.index = pager
      this.fetchData()
    },
    pagerSizeChange: function(size) {
      this.table.param.size = size
      this.table.param.index = 1
      this.fetchData()
    },
    addUser: function() {
    },
    fetchData() {
      this.listLoading = true
      getUserList(this.table.param).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.USER_SEX = (a.USER_SEX === '0' ? '男' : '女')
        })
        response.data.listMapData.forEach((a, b) => {
          a.USER_NONEXPIRED = (a.USER_NONEXPIRED === '0' ? '未过期' : '已过期')
        })
        response.data.listMapData.forEach((a, b) => {
          a.USER_NONLOCKED = (a.USER_NONLOCKED === '0' ? '未锁定' : '已锁定')
        })
        this.table.data = response.data.listMapData
        this.table.count = response.data.count
        this.listLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
