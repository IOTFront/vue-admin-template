<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" class="el-form-conts">
          <el-form-item label="角色名称">
            <el-input v-model="table.param.roleName" placeholder="通过角色名称搜索"/>
          </el-form-item>
          <el-form-item label="角色标识">
            <el-input v-model="table.param.roleCode" placeholder="通过角色标识搜索"/>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-form>
      </div>
      <div class="tableControl">
        <el-button type="success" @click="addRoleBtn">新增</el-button>
      </div>
      <div v-loading="tableLoading" class="tableConts">
        <el-table
          v-loading="tableLoading"
          :data="table.data"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            fixed
            prop="ROLE_NAME"
            label="角色名称"/>
          <el-table-column
            prop="ROLE_CODE"
            label="角色标识"/>
          <el-table-column
            prop="ROLE_SORT"
            label="排序"/>
          <el-table-column
            prop="CREATE_BY"
            label="创建人"/>
          <el-table-column
            prop="CREATE_DATE"
            label="创建时间"
            width="160"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editMenu(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deletMenu(scope.row)">删除</el-button>
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
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600px" @close="roleFormClose">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">

        <el-form-item
          :rules="[ { required: true, message: '角色名称', trigger: ['blur'] } ]"
          label="角色名称"
          prop="roleName"
          label-width="85px">
          <el-input v-model="roleForm.roleName"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '角色标识', trigger: ['blur'] } ]"
          label="角色标识"
          prop="roleCode"
          label-width="85px">
          <el-input v-model="roleForm.roleCode"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '角色排序', trigger: ['blur'] } ]"
          label="角色排序"
          prop="roleSort"
          label-width="85px">
          <el-input v-model="roleForm.roleSort"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="roleFormAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isRoleCodeOnly, addFwRole, deleteFwRoleById, updateFwRole, updateFwRoleUser, updateFwRoleResource, updateFwRoleMenu, getFwRoleById, getFwRoleByCode, getFwRoleToResource, getFwRoleToMenu, findFwRole } from '@/api/systemSet/role'
import { getFwOrgList } from '@/api/systemSet/organization'
import pagination from '@/components/pagination'

export default {
  components: {
    pagination
  },
  data: function() {
    var checkRoleCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色标识'))
      } else if (value !== this.roleForm.userAccountBase) {
        isRoleCodeOnly({ roleCode: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('角色标识已存在，请重新输入!'))
          }
        })
      } else {
        callback()
      }
    }

    return {
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur'] }
        ],
        roleCode: [
          { validator: checkRoleCode, trigger: 'blur' },
          { required: true, message: '请输入角色标识', trigger: ['blur'] }
        ],
        roleSort: [
          { required: true, message: '请输入角色排序', trigger: ['blur'] }
        ]
      },
      /* 对应表格接口
          * data            表格数据
          * param           表格的请求参数
          * count           总条目数
          * selectArry      表格选中的数据
          * tableLoading    表格的加载图 是否显示
          * */
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
      /* 表格新增/修改相关
          * roleName	[string]	是	名称
          * roleCode	[string]	是	标识，必须以 "ROLE_" 开头
          * roleSort	[number]	是	排序
          *
          * menuControlShow   模态框显示、隐藏
          * formType          模态框对应事件   1新增 2修改
          * */
      menuCtlData: {
        roleName: '',
        roleCode: '',
        roleSort: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      tableLoading: true,
      formType: 1,
      roleForm: {}
    }
  },
  created: function() {
    this.fetchData()
    getFwOrgList().then(res => {
      this.options = res.data
    })
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
    roleFormClose() {
      this.$refs['roleForm'].clearValidate()
    },
    addRoleBtn() {
      this.menuCtlData = {
        roleName: '',
        roleCode: '',
        roleSort: ''
      }
      this.roleForm = this.menuCtlData
      this.menuControlTitle = '新增角色'
      this.formType = 1
      this.menuControlShow = true
    },
    editMenu: function(row) {
      getFwRoleById({ roleId: row.ORG_ID }).then(res => {
        res.data.fwUser.userAccountBase = res.data.fwUser.userAccount
        this.roleForm = res.data.fwUser
        console.log(this.roleForm)
        this.menuControlTitle = '编辑角色'
        this.formType = 2
        this.menuControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('删除角色会删除角色的关联信息，是否删除角色 ' + row.ORG_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwRoleById({ orgId: row.ORG_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除角色' + row.ORG_NAME + '成功！',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(response.message)
          }
        }).catch(() => {
        })
      })
    },
    roleFormAction() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          var SendObj = JSON.parse(JSON.stringify(this.roleForm))
          if (this.formType === 1) {
            addFwRole(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加角色' + SendObj.userName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.roleForm = {
                roleName: '',
                roleCode: '',
                roleSort: ''
              }
            })
          } else {
            updateFwRole(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改角色' + SendObj.userName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.roleForm = {
                roleName: '',
                roleCode: '',
                roleSort: ''
              }
            })
          }
        } else {
          this.$message.error('请按照提示信息修改错误的内容')
        }
      })
    },
    fetchData() {
      this.tableLoading = true
      findFwRole(this.table.param).then(response => {
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
