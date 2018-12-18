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
            width="170">
            <template slot-scope="scope">
              <div class="operationConts">
                <el-button type="text" size="small" title="角色编辑" @click="editBase(scope.row)"><svg-icon icon-class="editBtn" /></el-button>
                <el-button type="text" size="small" title="角色对应资源管理" @click="editRes(scope.row)"><svg-icon icon-class="resourceSet" /></el-button>
                <el-button type="text" size="small" title="角色对应菜单管理" @click="editMenu(scope.row)"><svg-icon icon-class="menuSet" /></el-button>
                <el-button type="text" size="small" title="角色对应用户管理" @click="editMenu(scope.row)"><svg-icon icon-class="peoples" /></el-button>
                <el-button type="text" size="small" title="删除角色" @click="deletMenu(scope.row)"><svg-icon icon-class="deletBtn" /></el-button>
              </div>
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
    <el-dialog :title="menuControlTitle" :visible.sync="baseControlShow" width="600px" @close="roleFormClose">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          label="角色名称"
          prop="roleName"
          label-width="85px">
          <el-input v-model="roleForm.roleName"/>
        </el-form-item>
        <el-form-item
          label="角色标识"
          prop="roleCode"
          label-width="85px">
          <el-input v-model="roleForm.roleCode"/>
        </el-form-item>
        <el-form-item
          label="角色排序"
          prop="roleSort"
          label-width="85px">
          <el-input v-model="roleForm.roleSort"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baseControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="roleFormAction">确 定</el-button>
      </div>
    </el-dialog>

    <!--菜单编辑弹出层-->
    <el-dialog :visible.sync="menuControlShow" :title="'菜单管理-'+selectRole.ROLE_NAME" width="600px">
      <div class="centerBlps">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="menuTree"
            :data="menuDate"
            :props="menuDefaultProps"
            :check-on-click-node="true"
            :expand-on-click-node="false"
            default-expand-all
            node-key="MENU_ID"
            show-checkbox/>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="roleMenuAction">确 定</el-button>
      </div>
    </el-dialog>

    <!--资源编辑弹出层-->
    <el-dialog :visible.sync="resControlShow" :title="'资源管理-'+selectRole.ROLE_NAME" width="600px">
      <div class="centerBlps">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="resTree"
            :data="resDate"
            :props="resDefaultProps"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            default-expand-all
            show-checkbox
            node-key="RESOURCE_ID"/>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="roleResAction">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isRoleCodeOnly, addFwRole, deleteFwRoleById, updateFwRole, updateFwRoleUser, updateFwRoleResource, updateFwRoleMenu, getFwRoleById, getFwRoleByCode, getFwRoleToResource, getFwRoleToMenu, findFwRole } from '@/api/systemSet/role'
import { getMenuTree } from '@/api/systemSet/menu'
import { getFwResList } from '@/api/systemSet/rescourse'
import pagination from '@/components/pagination'

export default {
  components: {
    pagination
  },
  data: function() {
    var checkRoleCode = (rule, value, callback) => {
      console.log(2)
      if (value === '') {
        callback(new Error('请输入角色标识'))
      } else if (value !== this.roleForm.roleCodeBase) {
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
      menuDate: [], /* 菜单集合*/
      menuChecked: [], /* 当前菜单选中项*/
      menuDefaultProps: { /* 菜单配置项*/
        children: 'CHILDREN',
        label: 'MENU_NAME'
      },
      resDate: [], /* 资源集合*/
      resChecked: [], /* 当前资源选中项*/
      resDefaultProps: { /* 资源配置项*/
        children: 'CHILDREN',
        label: 'RESOURCE_NAME'
      },
      selectRole: '', /* 当前选中的角色对象*/
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
          roleName: '',
          roleCode: '',
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
          * menuControlShow   菜单编辑模态框显示、隐藏
          * baseControlShow   角色信息编辑模态框显示、隐藏
          * resControlShow    资源编辑模态框显示、隐藏
          * formType          模态框对应事件   1新增 2修改
          * */
      menuCtlData: {
        roleName: '',
        roleCode: '',
        roleSort: ''
      },
      menuControlTitle: '',
      baseControlShow: false,
      menuControlShow: false,
      resControlShow: false,
      tableLoading: true,
      formType: 1,
      roleForm: {}
    }
  },
  created: function() {
    this.fetchData()
    getMenuTree().then(res => {
      this.menuDate = res.data
    })
    getFwResList().then(res => {
      this.resDate = res.data
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
        roleSort: '',
        roleCodeBase: ''
      }
      this.roleForm = this.menuCtlData
      this.menuControlTitle = '新增角色'
      this.formType = 1
      this.baseControlShow = true
    },
    editBase: function(row) {
      getFwRoleById({ roleId: row.ROLE_ID }).then(res => {
        res.data.roleCodeBase = res.data.roleCode
        this.roleForm = res.data
        console.log(this.roleForm)
        this.menuControlTitle = '编辑角色'
        this.formType = 2
        this.baseControlShow = true
      })
    },
    editRes: function(row) { /* 资源管理*/
      this.selectRole = row
      getFwRoleToResource({ roleId: row.ROLE_ID }).then(res => {
        this.resChecked = []
        res.data.forEach((a, b) => {
          this.resChecked.push(a.RESOURCE_ID)
        })
        this.resControlShow = true
        this.$nextTick(() => {
          /* 展开所有节点*/
          for (var i = 0; i < this.$refs.resTree.store._getAllNodes().length; i++) {
            this.$refs.resTree.store._getAllNodes()[i].expanded = true
          }
          this.$refs.resTree.setCheckedKeys(this.resChecked)
        })
      })
    },
    editMenu: function(row) { /* 菜单管理*/
      this.selectRole = row
      getFwRoleToMenu({ roleId: row.ROLE_ID }).then(res => {
        this.menuChecked = []
        res.data.forEach((a, b) => {
          this.menuChecked.push(a.MENU_ID)
        })
        this.menuControlShow = true
        this.$nextTick(() => {
          /* 展开所有节点*/
          for (var i = 0; i < this.$refs.menuTree.store._getAllNodes().length; i++) {
            this.$refs.menuTree.store._getAllNodes()[i].expanded = true
          }
          this.$refs.menuTree.setCheckedKeys(this.menuChecked)
        })
      })
    },
    deletMenu(row) {
      this.$confirm('删除角色会删除角色的关联信息，是否删除角色 ' + row.ROLE_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwRoleById({ roleId: row.ROLE_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除角色' + row.ROLE_NAME + '成功！',
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
                  message: '恭喜你，添加角色' + SendObj.roleName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
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
                  message: '恭喜你，修改角色' + SendObj.roleName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
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
    roleMenuAction() {
      var sendJSON = {
        roleId: this.selectRole.ROLE_ID,
        menuIds: this.$refs.menuTree.getCheckedKeys().toString()
      }
      updateFwRoleMenu(sendJSON).then(response => {
        if (response.data) {
          this.$message({
            message: '恭喜你，已成功修改角色 ' + this.selectRole.ROLE_NAME + ' 对应的菜单！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
        this.menuControlShow = false
      })
    },
    roleResAction() {
      var sendJSON = {
        roleId: this.selectRole.ROLE_ID,
        resourceIds: this.$refs.resTree.getCheckedKeys().toString()
      }
      updateFwRoleResource(sendJSON).then(response => {
        if (response.data) {
          this.$message({
            message: '恭喜你，已成功修改角色 ' + this.selectRole.ROLE_NAME + ' 对应的资源！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
        this.resControlShow = false
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
  .centerBlps{
    max-height:55vh;
    .el-scrollbar {
      height: 55vh;
    }
  }
</style>
