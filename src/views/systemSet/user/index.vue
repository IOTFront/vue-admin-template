<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" class="el-form-conts">
          <el-form-item label="账号">
            <el-input v-model="table.param.userName" placeholder="通过账号搜索"/>
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
        <el-button type="success" @click="addUserBtn">新增</el-button>
        <el-button type="danger" >批量删除</el-button>
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
    <!--新增/修改弹出层-->
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600px" @close="resFormClose">
      <el-form ref="resForm" :model="resForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          :rules="[ { required: true, message: '请输入资源名称', trigger: ['blur'] } ]"
          label="资源名称"
          prop="resourceName"
          label-width="85px">
          <el-input v-model="resForm.resourceName"/>
        </el-form-item>
        <el-form-item
          label="资源链接"
          prop="resourcePath"
          label-width="85px">
          <el-input v-model="resForm.resourcePath"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请选择资源类型', trigger: ['blur'] } ]"
          label="资源类型"
          prop="resourceType"
          label-width="85px">
          <el-select
            v-model="resForm.resourceType"
            style="width: 100%;"
            placeholder="请选择类型">
            <el-option label="数据请求" value="GET"/>
            <el-option label="表单提交" value="POST"/>
            <el-option label="数据修改" value="PUT"/>
            <el-option label="数据删除" value="DELETE"/>
            <el-option label="上传" value="UPLOAD"/>
            <el-option label="下载" value="DOWNLOAD"/>
          </el-select>
        </el-form-item>        <el-form-item
          :rules="[ { required: true,type: 'number', message: '请输入排序数字', trigger: ['blur'] } ]"
          label="资源排序"
          prop="resourceSort"
          label-width="85px">
          <el-input v-model.number="resForm.resourceSort" type="number"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请输入资源描述', trigger: ['blur'] } ]"
          label="资源描述"
          prop="resourceDesc"
          label-width="85px">
          <el-input v-model="resForm.resourceDesc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="resFormAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/systemSet/userControl/table'
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
          userName: '',
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
      tableLoading: true,
      addShowBol: false,
      addOrEditTitle: '新增用户',
      test: ''
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
    addUserBtn: function() {
      this.addShowBol = true
    },
    addUserAction: function() {
      this.addShowBol = false
    },
    fetchData() {
      this.tableLoading = true
      getUserList(this.table.param).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.USER_SEX = (a.USER_SEX === '0' ? '男' : '女')
          a.USER_NONLOCKED = (a.USER_NONLOCKED === '0' ? '未锁定' : '已锁定')
          a.USER_NONEXPIRED = (a.USER_NONEXPIRED === '0' ? '未过期' : '已过期')
        })
        this.table.data = response.data.listMapData
        this.table.count = response.data.count
        this.tableLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
