<template>
  <div class="haveUsers">
    <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addUserToRole">添加人员</el-button>
    <div class="tableConts" style="margin-top: 20px;">
      <el-table
        v-loading="R2UtableLoading"
        :data="table.data"
        :key="roleid+'tanleOl'"
        border
        height="235"
        style="width: 100%">
        <el-table-column
          prop="USER_ACCOUNT"
          label="账号"
          width="150"/>
        <el-table-column
          prop="ROLE_NAME"
          label="角色名称"/>
        <el-table-column
          prop="ORG_NAME"
          label="所属机构名称"/>
        <el-table-column
          prop="USER_NONLOCKED_NAME"
          width="120"
          label="是否锁定"/>
        <el-table-column
          prop="USER_NONEXPIRED_NAME"
          width="120"
          label="是否过期"/>
        <el-table-column
          label="操作"
          align="center"
          width="80">
          <template slot-scope="scope">
            <div class="operationConts">
              <el-button type="text" size="small" title="移除用户" @click="deletRoleTouser(scope.row)">
                <svg-icon icon-class="userRemove"/>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination
          :total="table.count"
          :pager="table.param.index"
          :pagesize="table.param.size"
          :layout="'total,prev, pager, next, jumper'"
          :key="roleid+'pages'"
          @pagersizechange="pagerSizeChange"
          @pagerchange="pagerChange"/>
      </div>
    </div>

    <!--角色选择用户弹出层-->
    <el-dialog :visible.sync="roleShowNoSelect" :key="roleid+'selectUs'" title="角色添加用户" width="1000px">
      <div>
        <role-no-user :roleid="roleid" :rolename="rolename" @selectUsers="selectUsersAct"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleShowNoSelect = false;">取 消</el-button>
        <el-button type="primary" @click="roleAddUserAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList
} from '@/api/systemSet/userControl/table'
import {
  deleteRoleForUser,
  addFwRoleUser
} from '@/api/systemSet/role'
import pagination from '@/components/pagination'
import roleNoUser from '../roleNoUser'

export default {
  name: 'RoleHavaUser',
  components: {
    'role-no-user': roleNoUser,
    pagination
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
      /* 对应表格接口
          * data            表格数据
          * param           表格的请求参数
          * count           总条目数
          * selectArry      表格选中的数据
          * R2UtableLoading    表格的加载图 是否显示
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
          size: 5
        },
        count: 0,
        selectArry: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      roleShow: false,
      userEdit: false,
      roleShowNoSelect: false,
      R2UtableLoading: false,
      selectUserDatas: [],
      getRowKeys(row) {
        return row.USER_ID + 'Kef'
      }
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    selectUsersAct(rows) {
      this.selectUserDatas = rows
    },
    fetchData() {
      this.R2UtableLoading = true
      var searchJSON = JSON.parse(JSON.stringify(this.table.param))
      if (searchJSON.orgId.length > 0) {
        searchJSON.orgId = searchJSON.orgId[searchJSON.orgId.length - 1]
      } else {
        searchJSON.orgId = ''
      }
      getUserList(searchJSON).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.USER_NONLOCKED_NAME = (a.USER_NONLOCKED === '0' ? '未锁定' : '已锁定')
          a.USER_NONEXPIRED_NAME = (a.USER_NONEXPIRED === '0' ? '未过期' : '已过期')
        })
        this.table.data = response.data.listMapData
        this.table.count = response.data.count
        this.R2UtableLoading = false
      })
    },
    deletRoleTouser(row) {
      this.$confirm('移除当前账号会失去角色‘' + this.rolename + '’，是否移除账号 ' + row.USER_ACCOUNT + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleForUser({ userId: row.USER_ID, roleId: this.roleid }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，移除账号' + row.USER_ACCOUNT + '成功！',
              type: 'success'
            })
            this.table.param.index = 1
            this.fetchData()
          } else {
            this.$message.error(response.message)
          }
        }).catch(() => {
        })
      })
    },
    addUserToRole() {
      this.selectUserDatas = []
      this.roleShowNoSelect = true
    },
    roleAddUserAction() {
      console.log(this.selectUserDatas)
      if (this.selectUserDatas.length <= 0) {
        this.$message.error('请选择要赋予角色‘' + this.rolename + '’的账号！')
      } else {
        var NewAry = []
        this.selectUserDatas.forEach(a => {
          NewAry.push(a.USER_ID)
        })
        addFwRoleUser({
          roleId: this.roleid,
          userIds: NewAry.toString()
        }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，添加成功！',
              type: 'success'
            })
            this.table.param.index = 1
            this.fetchData()
            this.roleShowNoSelect = false
          } else {
            this.$message.error(response.message)
          }
        })
      }
      this.table.param.index = 1
      this.fetchData()
    },
    pagerChange: function(pager) {
      this.table.param.index = pager
      this.fetchData()
    },
    pagerSizeChange: function(size) {
      this.table.param.size = size
      this.table.param.index = 1
      this.fetchData()
    }
  }
}
</script>
<style rel="stylesheet/css">

</style>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
