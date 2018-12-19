<template>
  <div class="roleNouser">
    <el-row>
      <el-col :span="contLayout[0]">
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
              <el-form-item label="操作">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-loading="tableLoading" class="tableConts">
            <el-table
              v-loading="tableLoading"
              :data="table.data"
              border
              height="247"
              style="width: 100%"
              @select="selectionChange"
              @select-all="selectUSerAll">
              <el-table-column
                type="selection"
                width="55"/>
              <el-table-column
                prop="USER_ACCOUNT"
                label="账号"
                width="150"/>
              <el-table-column
                prop="ORG_NAME"
                label="所属机构名称"/>
              <el-table-column
                prop="USER_NONLOCKED_NAME"
                width="120"
                label="是否锁定">
                <template slot-scope="scope">
                  <div class="fixedChange">
                    <span>{{ scope.row.USER_NONLOCKED_NAME }}</span>
                    <el-button type="text" size="small" class="userChangeTurn" >&nbsp;</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="USER_NONEXPIRED_NAME"
                width="120"
                label="是否过期"/>
            </el-table>
            <div>
              <pagination
                :total="table.count"
                :pager="table.param.index"
                :pagesize="table.param.size"
                :layout="'total,prev, pager, next, jumper'"
                @pagersizechange="pagerSizeChange"
                @pagerchange="pagerChange"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-if="selectData.length>0" :span="contLayout[1]">
        <div class="sshowConts">
          <div class="tls">已选用户</div>
          <div class="selectSHowConts">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <el-button v-for="item in selectData" size="mini" title="移除用户" @click="selectRemove(item)">{{ item.USER_ACCOUNT }}<i class="el-icon-circle-close el-icon--right"/></el-button>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserList, addFwUser, updateFwUserOrg, deleteFwUserById, deleteBatchFwUser, getFwUser, isFwUserOnly, updateUserPassword, getFwUserToRole, updateFwUserRole, updateFwUserNonlocked, updateFwUserNonexpired } from '@/api/systemSet/userControl/table'
import {
  findFwRoleNoToUser
} from '@/api/systemSet/role'
import { getFwOrgList } from '@/api/systemSet/organization'
import { findFwRole } from '@/api/systemSet/role'
import pagination from '@/components/pagination'
import imgCutUpload from '@/components/imgCutUpload'

export default {
  components: {
    pagination,
    'my-upload': imgCutUpload
  },
  props: {
    roleid: {
      type: String,
      required: true
    },
    rolename: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      /* 机构级联选择器*/
      options: [],
      orgprops: {
        value: 'ORG_ID',
        label: 'ORG_NAME',
        children: 'CHILDREN'
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
          roleId: this.roleid,
          index: 1,
          size: 6
        },
        count: 0,
        selectArry: ''
      },
      userEdit: false,
      tableLoading: true,
      formType: 1,
      userForm: {},
      roleSelectDate: [],
      contLayout: [24, 0],
      selectData: []
    }
  },
  watch: {
    selectData() {
      if (this.selectData.length > 0) {
        this.contLayout = [17, 7]
      } else {
        this.contLayout = [24, 0]
      }
      this.$emit('selectUsers',this.selectData);
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
    selectionChange: function(selection, row) {
      const selected = selection.indexOf(row)
      const selectBol = selected !== -1
      if (selectBol) {
        this.selectData.push(row)
      } else {
        this.selectData = this.delectSelect(row)
      }
    },
    selectRemove(row) {
      this.selectData = this.delectSelect(row)
    },
    selectUSerAll(selection) {
      if (selection.length > 0) {
        this.fixedSelect(selection)
      } else {
        this.selectData = this.delectAllSelect(this.table.data)
      }
    },
    delectSelect(res) {
      var NewArry = []
      this.selectData.forEach((a, b) => {
        if (a.USER_ID !== res.USER_ID) {
          NewArry.push(a)
        }
      })
      return NewArry
    },
    delectAllSelect(rows) {
      var NewArry = []
      this.selectData.forEach((a) => {
        var TsBol = true
        rows.forEach((as) => {
          if (a.USER_ID === as.USER_ID) {
            TsBol = false
          }
        })
        if (TsBol) {
          (
            NewArry.push(a)
          )
        }
      })
      return NewArry
    },
    fixedSelect(rows) {
      rows.forEach((a) => {
        var TsBol = true
        this.selectData.forEach((as) => {
          if (a.USER_ID === as.USER_ID) {
            TsBol = false
          }
        })
        if (TsBol) {
          (
            this.selectData.push(a)
          )
        }
      })
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
    changeLocked(row) {
      var sendJson = {
        userId: row.USER_ID,
        userNonlocked: (row.USER_NONLOCKED === '0' ? 1 : 0)
      }
      updateFwUserNonlocked(sendJson).then(response => {
        if (response.data) {
          this.$message({
            message: '恭喜你，已成功' + (sendJson.userNonlocked === 0 ? '解锁' : '锁定') + '账号 ' + row.USER_ACCOUNT + '！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    changeExpired(row) {
      var sendJson = {
        userId: row.USER_ID,
        userNonexpired: (row.USER_NONEXPIRED === '0' ? 1 : 0)
      }
      updateFwUserNonexpired(sendJson).then(response => {
        if (response.data) {
          this.$message({
            message: '恭喜你，已成功设置' + '账号 ' + row.USER_ACCOUNT + ' 为' + (sendJson.userNonexpired === 0 ? '未过期' : '过期') + '！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(response.message)
        }
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
      findFwRoleNoToUser(searchJSON).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.USER_NONLOCKED_NAME = (a.USER_NONLOCKED === '0' ? '未锁定' : '已锁定')
          a.USER_NONEXPIRED_NAME = (a.USER_NONEXPIRED === '0' ? '未过期' : '已过期')
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
.sshowConts{
  border: 1px solid #ececec;
  border-radius: 3px;
  margin: 0 20px;
  height: 100%;
  .tls{
    padding: 10px;
    border-bottom: 1px solid #ececec;
  }
  .selectSHowConts{
    padding: 10px;
    height: 360px;
    .el-button{
      margin: 10px;
    }
  }
}

</style>
