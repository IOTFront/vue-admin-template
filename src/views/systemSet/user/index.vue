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
            <el-select v-model="table.param.userNonexpired" placeholder="请选择">
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
          v-loading="tableLoading"
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
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600px" @close="userFormClose">
      <el-form ref="userForm" :model="userForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          label="用户账号"
          prop="userAccount"
          label-width="85px">
          <el-input v-model="userForm.userAccount"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '用户名称', trigger: ['blur'] } ]"
          label="用户名称"
          prop="userName"
          label-width="85px">
          <el-input v-model="userForm.userName"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '用户性别', trigger: ['blur'] } ]"
          label="用户性别"
          prop="userSex"
          label-width="85px">
          <el-select
            v-model="userForm.userSex"
            style="width: 100%;"
            placeholder="请选择类型">
            <el-option label="男" value="0"/>
            <el-option label="女" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="userMobile"
          label-width="85px">
          <el-input v-model="userForm.userMobile"/>
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
            :show-all-levels="false"
            :value="userForm.orgId"
            v-model="userForm.orgId"
            style="width: 100%;"
            expand-trigger="hover"/>
        </el-form-item>
        <el-form-item
          v-if="formType===1"
          :rules="[ { required: true, message: '请输入密码', trigger: ['blur'] } ]"
          label="用户密码"
          prop="userPassword"
          label-width="85px">
          <el-input v-model="userForm.userPassword"/>
        </el-form-item>
        <el-form-item
          label="用户头像"
          prop="userPhoto"
          label-width="85px">
          <el-input v-model="userForm.userPhoto" type="hidden" />
          <div class="setBtns">
            <div v-if="userForm.userPhoto!=''">
              <img :src="userForm.userPhoto" class="usrImgs" @click="userSelectImg">
            </div>
            <div v-else>
              <el-button class="slBtns" @click="userSelectImg">选择头像</el-button>
            </div>
          </div>
          <my-upload
            v-model="imgCutUploadParams.show"
            :width="300"
            :height="300"
            :params="imgCutUploadParams.params"
            field="img"
            img-format="png"
            @crop-success="cropSuccess"/>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="userFormAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addFwUser, updateFwUser, deleteFwUserById, getFwUser, isFwUserOnly } from '@/api/systemSet/userControl/table'
import { getFwOrgList } from '@/api/systemSet/organization'
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
        callback(new Error('请输入用户账号'))
      } else if (value !== this.userForm.userAccountBase) {
        isFwUserOnly({ userAccount: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('用户账号已存在，请重新输入!'))
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
      /* 图片剪切相关内容*/
      imgCutUploadParams: {
        show: false,
        params: {
          token: '123456798',
          name: 'avatar'
        },
        headers: {
          smail: '*_~'
        },
        imgDataUrl: '' // base64地址存储位置
      },
      /* 机构级联选择器*/
      options: {

      },
      orgprops: {
        value: 'ORG_ID',
        label: 'ORG_NAME',
        children: 'CHILDREN'
      },
      rules: {
        userAccount: [
          { validator: validateuserCount, trigger: 'blur' },
          { required: true, message: '请输入用户账号', trigger: ['blur'] }
        ],
        userMobile: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '请输入手机号码', trigger: ['blur'] }
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
        * orgId	[string]	是	机构ID
        * userAccount	[string]	是	账号
        * userPassword	[string]	是	密码
        * userName	[string]	是	昵称
        * userSex	[string]	是	性别【0-男、1-女】
        * userMobile	[string]	是	手机
        * userPhoto 复制	[string]	是	照片（Base64）
        *
        * menuControlShow   模态框显示、隐藏
        * formType          模态框对应事件   1新增 2修改
        * */
      menuCtlData: {
        orgId: [],
        userAccount: '',
        userPassword: '',
        userName: '',
        userSex: '',
        userPhoto: '',
        userMobile: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      tableLoading: true,
      formType: 1,
      userForm: {}
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
    userFormClose() {
      this.$refs['userForm'].clearValidate()
    },
    addUserBtn() {
      this.menuCtlData = {
        orgId: [],
        userAccount: '',
        userPassword: '',
        userName: '',
        userSex: '',
        userPhoto: '',
        userMobile: '',
        userAccountBase: ''
      }
      this.userForm = this.menuCtlData
      this.menuControlTitle = '新增用户'
      this.formType = 1
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
        this.menuControlTitle = '编辑用户'
        this.formType = 2
        this.menuControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('删除用户会删除用户的关联信息，是否删除用户 ' + row.USER_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwUserById({ userId: row.USER_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除用户' + row.USER_NAME + '成功！',
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
    userFormAction() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          var SendObj = JSON.parse(JSON.stringify(this.userForm))
          SendObj.orgId = SendObj.orgId[SendObj.orgId.length - 1]
          if (this.formType === 1) {
            addFwUser(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加用户' + SendObj.userName + '成功！',
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
                userName: '',
                userSex: '',
                userPhoto: '',
                userMobile: '',
                userAccountBase: ''
              }
            })
          } else {
            updateFwUser(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改用户' + SendObj.userName + '成功！',
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
                userName: '',
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
    },
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------' + imgDataUrl)
      this.userForm.userPhoto = imgDataUrl
    },
    userSelectImg: function() {
      this.imgCutUploadParams.show = true
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
</style>
