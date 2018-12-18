<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" label-position="top" class="el-form-conts">
          <el-form-item label="账号">
            <el-input v-model="table.param.userAccount" placeholder="通过账号搜索"/>
          </el-form-item>
          <el-form-item label="所属机构">
            <el-cascader
              :options="options"
              :props="orgprops"
              :change-on-select="true"
              :clearable="true"
              v-model="table.param.orgId"
              filterable
              style="width: 100%;"
              expand-trigger="hover"/>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="table.param.roleId" :clearable="true" filterable placeholder="请选择">
              <el-option v-for="opt in roleSelectDate" :label="opt.ROLE_NAME" :value="opt.ROLE_ID"/>
            </el-select>
          </el-form-item>
          <el-form-item label="账号是否锁定">
            <el-select v-model="table.param.userNonlocked" placeholder="请选择">
              <el-option label="未锁定" value="0"/>
              <el-option label="已锁定" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="账号是否过期">
            <el-select v-model="table.param.userNonexpired" placeholder="请选择">
              <el-option label="未过期" value="0"/>
              <el-option label="已过期" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableControl">
        <el-button type="success" @click="addUserBtn">新增</el-button>
        <el-button type="danger" @click="deleteBatchFwUser">批量删除</el-button>
      </div>
      <div v-loading="tableLoading" class="tableConts">
        <el-table
          v-loading="tableLoading"
          :data="table.data"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column
            prop="USER_ACCOUNT"
            label="账号"
            width="150"/>
          <el-table-column
            prop="ROLE_NAME"
            label="角色名称"
            width="320"/>
          <el-table-column
            prop="ORG_NAME"
            label="所属机构名称"
            width="220"/>
          <el-table-column
            prop="USER_NONLOCKED"
            label="是否锁定"/>
          <el-table-column
            prop="USER_NONEXPIRED"
            label="是否过期"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="140">
            <template slot-scope="scope">
              <div class="operationConts">
                <el-button type="text" size="small" title="所属机构修改" @click="editMenu(scope.row)"><svg-icon icon-class="tree" /></el-button>
                <el-button type="text" size="small" title="角色修改" @click="editRole(scope.row)"><svg-icon icon-class="roleSet" /></el-button>
                <el-button type="text" size="small" title="密码修改" @click="changePwd(scope.row)"><svg-icon icon-class="lock" /></el-button>
                <el-button type="text" size="small" title="删除" @click="deletMenu(scope.row)"><svg-icon icon-class="deletBtn" /></el-button>
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
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600px" @close="userFormClose">
      <el-form ref="userForm" :model="userForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          label="账号"
          prop="userAccount"
          label-width="85px">
          <el-input :disabled="userEdit" v-model="userForm.userAccount"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请选择机构', trigger: ['blur'] } ]"
          label="所属机构"
          prop="orgId"
          label-width="85px">
          <el-cascader
            :options="options"
            :props="orgprops"
            :change-on-select="true"
            :clearable="true"
            :show-all-levels="false"
            :value="userForm.orgId"
            v-model="userForm.orgId"
            style="width: 100%;"
            filterable
            expand-trigger="hover"/>
        </el-form-item>
        <el-form-item
          v-if="formType===1"
          :rules="[ { required: true, message: '请输入密码', trigger: ['blur'] } ]"
          label="账号密码"
          prop="userPassword"
          label-width="85px">
          <el-input v-model="userForm.userPassword"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="userFormAction">确 定</el-button>
      </div>
    </el-dialog>

    <!--账户角色弹出层-->
    <el-dialog :visible.sync="roleShow" title="角色管理" width="600px">
      <div class="centerBlps">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-tree
            ref="roleTree"
            :data="roleDate"
            :props="roleDefaultProps"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            default-expand-all
            show-checkbox
            node-key="ROLE_ID"/>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleShow = false;">取 消</el-button>
        <el-button type="primary" @click="roleAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addFwUser, updateFwUserOrg, deleteFwUserById, deleteBatchFwUser, getFwUser, isFwUserOnly, updateUserPassword, getFwUserToRole, updateFwUserRole } from '@/api/systemSet/userControl/table'
import { getFwOrgList } from '@/api/systemSet/organization'
import { findFwRole } from '@/api/systemSet/role'
import pagination from '@/components/pagination'
import imgCutUpload from '@/components/imgCutUpload'

export default {
  components: {
    pagination,
    'my-upload': imgCutUpload
  },
  data: function() {
    var validateuserCount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (value !== this.userForm.userAccountBase) {
        isFwUserOnly({ userAccount: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('账号已存在，请重新输入!'))
          }
        })
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      /* 用户角色切换*/
      roleDate: [], /* 菜单集合*/
      roleChecked: [], /* 当前菜单选中项*/
      roleDefaultProps: { /* 菜单配置项*/
        children: 'CHILDREN',
        label: 'ROLE_NAME'
      },
      /* 机构级联选择器*/
      options: [],
      orgprops: {
        value: 'ORG_ID',
        label: 'ORG_NAME',
        children: 'CHILDREN'
      },
      rules: {
        userAccount: [
          { validator: validateuserCount, trigger: 'blur' },
          { required: true, message: '请输入账号', trigger: ['blur'] }
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
          userAccount: '',
          userNonlocked: '',
          userNonexpired: '',
          orgId: [],
          roleId: '',
          index: 1,
          size: 10
        },
        count: 0,
        selectArry: ''
      },
      /* 表格新增/修改相关
        *  userId	[string]	是	用户id	展开
        *  userParentId	[string]	是	父级用户id	展开
        *  orgId	[string]	是	所属机构id	展开
        *  userAccount	[string]	是	账号	展开
        *  userPassword	[string]	是	密码	展开
        *  userNonlocked	[string]	是	是否锁定【0-未锁定、1-已锁定】	展开
        *  userNonexpired	[string]	是	是否过期【0-未过期、1-已过期】	展开
        *  userIsSystem	[string]	是	是否系统账号【0-否、1-是】
        *  createBy	[string]	是	创建人
        *  createDate	[string]	是	创建时间	展开
        *  updateBy	[string]	是	更新人
        *  updateDate	[string]	是	更新时间
        *  delFlag	[number]	是	是否有效【0-无效、1-有效】
        * */
      menuCtlData: {
        orgId: [],
        userId: '',
        userParentId: '',
        userAccount: '',
        userPassword: '',
        userNonlocked: '',
        userNonexpired: '',
        userIsSystem: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: '',
        delFlag: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      roleShow: false,
      userEdit: false,
      tableLoading: true,
      formType: 1,
      userForm: {},
      roleSelectDate: []
    }
  },
  created: function() {
    this.fetchData()
    getFwOrgList().then(res => {
      this.options = res.data
    })
    findFwRole({ index: 1, size: 100 }).then(response => {
      this.roleSelectDate = response.data.listMapData
      this.roleDate = response.data.listMapData
    })
  },
  methods: {
    handleClick(row) {
      console.log(row)
    },
    handleSearch: function() {
      this.fetchData()
    },
    resetSearch: function() {
      this.table.param = {
        userAccount: '',
        userNonlocked: '',
        userNonexpired: '',
        orgId: [],
        roleId: '',
        index: 1,
        size: 10
      }
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
    userFormClose() {
      this.$refs['userForm'].clearValidate()
    },
    addUserBtn() {
      this.menuCtlData = {
        orgId: [],
        userAccount: '',
        userPassword: '',
        userSex: '',
        userPhoto: '',
        userMobile: '',
        userAccountBase: ''
      }
      this.userForm = this.menuCtlData
      this.menuControlTitle = '新增账号'
      this.formType = 1
      this.userEdit = false
      this.menuControlShow = true
    },
    deleteBatchFwUser() {
      var sendArry = []
      if (this.table.selectArry.length <= 0) {
        this.$message.error('请选择要删除的账号！')
      } else {
        this.$confirm('删除账号会删除账号的关联信息，是否删除已选中的账号 ?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.table.selectArry.forEach((a, b) => {
            sendArry.push(a.USER_ID)
          })
          deleteBatchFwUser({ userIds: sendArry.toString() }).then(response => {
            if (response.data) {
              this.$message({
                message: '恭喜你，批量删除成功！',
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message.error(response.message)
            }
          }).catch(() => {
          })
        })
      }
    },
    editMenu: function(row) {
      getFwUser({ userId: row.USER_ID }).then(res => {
        res.data.fwUser.userAccountBase = res.data.fwUser.userAccount
        this.userForm = res.data.fwUser
        var NewArry = []
        res.data.fwOrgMap.forEach((a, b) => {
          NewArry.push(a.ORG_ID)
        })
        this.userForm.orgId = NewArry
        console.log(this.userForm)
        this.menuControlTitle = '修改账号所属机构'
        this.formType = 2
        this.userEdit = true
        this.menuControlShow = true
      })
    },
    editRole(row) {
      this.selectUser = row
      getFwUserToRole({ userId: row.USER_ID }).then(res => {
        this.roleChecked = []
        res.data.forEach((a, b) => {
          this.roleChecked.push(a.ROLE_ID)
        })
        this.roleShow = true
        this.$nextTick(() => {
          /* 展开所有节点*/
          this.$refs.roleTree.setCheckedKeys(this.roleChecked)
        })
      })
    },
    roleAction() {
      var sendJSON = {
        userId: this.selectUser.USER_ID,
        roleIds: this.$refs.roleTree.getCheckedKeys().toString()
      }
      updateFwUserRole(sendJSON).then(response => {
        if (response.data) {
          this.$message({
            message: '恭喜你，已成功修改账号 ' + this.selectUser.USER_ACCOUNT + ' 对应的角色！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
        this.roleShow = false
      })
    },
    deletMenu(row) {
      this.$confirm('删除账号会删除账号的关联信息，是否删除账号 ' + row.USER_ACCOUNT + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwUserById({ userId: row.USER_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除账号' + row.USER_ACCOUNT + '成功！',
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
    changePwd(row) {
      this.$prompt('请输入“' + row.USER_ACCOUNT + '”的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPattern: /^(\w){6,20}$/,
        inputPlaceholder: '请输入6-20位的密码',
        inputErrorMessage: '请输入6-20位的密码'
      }).then(({ value }) => {
        updateUserPassword({
          userId: row.USER_ID,
          userPassword: value
        }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，账号' + row.USER_ACCOUNT + '的密码修改成功！',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(response.message)
          }
        })
      }).catch(() => {
      })
    },
    userFormAction() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          var SendObj = JSON.parse(JSON.stringify(this.userForm))
          SendObj.orgId = SendObj.orgId[SendObj.orgId.length - 1]
          if (this.formType === 1) {
            addFwUser(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加账号' + SendObj.userAccount + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.userForm = {
                orgId: this.userForm.orgId,
                userPassword: '',
                userAccount: '',
                userSex: '',
                userPhoto: '',
                userMobile: '',
                userAccountBase: ''
              }
            })
          } else {
            updateFwUserOrg(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改账号' + SendObj.userAccount + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.userForm = {
                orgId: this.userForm.orgId,
                userAccount: '',
                userPassword: '',
                userSex: '',
                userPhoto: '',
                userMobile: '',
                userAccountBase: ''
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
      var searchJSON = JSON.parse(JSON.stringify(this.table.param))
      if (searchJSON.orgId.length > 0) {
        searchJSON.orgId = searchJSON.orgId[searchJSON.orgId.length - 1]
      } else {
        searchJSON.orgId = ''
      }
      getUserList(searchJSON).then(response => {
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
.setBtns{
  position: relative;
  top:-40px;
  max-height: 160px;
  .usrImgs{
    width: 200px;
    height: 200px;
    padding: 2px;
    border: 1px solid #ececec;
  }
}
.centerBlps{
  max-height:55vh;
  .el-scrollbar {
    height: 55vh;
  }
}
</style>
