<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" label-position="top" class="el-form-conts">
          <el-form-item label="姓氏">
            <el-input v-model="table.param.surnameName" placeholder="通过姓氏搜索"/>
          </el-form-item>
          <el-form-item label="拼音">
            <el-input v-model="table.param.surnamePinyin" placeholder="通过拼音搜索"/>
          </el-form-item>
          <el-form-item label="笔画数">
            <el-input v-model="table.param.surnameStrokes" type="number" placeholder="通过笔画数搜索"/>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-select
              v-model="table.param.surnameRecommend"
              :clearable="true"
              placeholder="请选择">
              <el-option label="否" value="0"/>
              <el-option label="是" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
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
          style="width: 100%">
          <el-table-column
            prop="SURNAME_NAME"
            label="姓氏"/>
          <el-table-column
            prop="SURNAME_INITIALS"
            label="首字母"/>
          <el-table-column
            prop="SURNAME_PINYIN"
            label="拼音"/>

          <el-table-column
            prop="SURNAME_STROKES"
            label="笔画数"/>

          <el-table-column
            prop="SURNAME_SORT"
            label="排序"/>
          <el-table-column
            prop="SURNAME_RECOMMEND_NAME"
            label="是否推荐"/>

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
            width="80">
            <template slot-scope="scope">
              <div class="operationConts">
                <el-button type="text" size="small" title="姓氏编辑" @click="editBase(scope.row)"><svg-icon icon-class="editBtn" /></el-button>
                <el-button type="text" size="small" title="删除姓氏" @click="deletMenu(scope.row)"><svg-icon icon-class="deletBtn" /></el-button>
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
          label="姓氏"
          prop="surnameName"
          label-width="85px">
          <el-input v-model="roleForm.surnameName"/>
        </el-form-item>
        <el-form-item
          label="笔画数"
          prop="surnameStrokes"
          label-width="85px">
          <el-input v-model="roleForm.surnameStrokes" type="number"/>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="surnameSort"
          label-width="85px">
          <el-input v-model="roleForm.surnameSort" type="number"/>
        </el-form-item>
        <el-form-item
          label="是否推荐"
          prop="surnameRecommend"
          label-width="85px">
          <el-select
            v-model="roleForm.surnameRecommend"
            style="width: 100%;"
            placeholder="请选择">
            <el-option label="否" value="0"/>
            <el-option label="是" value="1"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="baseControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="roleFormAction">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isFwSurnameOnly, addFwSurname, deleteFwSurnameById, updateFwSurname, getFwSurnameById, findFwSurname } from '@/api/dataSet/surnameSet'
import pagination from '@/components/pagination'

export default {
  components: {
    pagination
  },
  data: function() {
    var checkRoleCode = (rule, value, callback) => {
      console.log(2)
      if (value === '') {
        callback(new Error('请输入姓氏'))
      } else if (value !== this.roleForm.surnameNameBase) {
        isFwSurnameOnly({ surnameName: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('姓氏已存在，请重新输入!'))
          }
        })
      } else {
        callback()
      }
    }

    return {
      rules: {
        surnameStrokes: [
          { required: true, message: '请输入笔画数', trigger: ['blur'] }
        ],
        surnameName: [
          { validator: checkRoleCode, trigger: 'blur' },
          { required: true, message: '请输入姓氏', trigger: ['blur'] }
        ],
        surnameSort: [
          { required: true, message: '请输入姓氏排序', trigger: ['blur'] }
        ],
        surnameRecommend: [
          { required: true, message: '请选择是否推荐', trigger: ['blur'] }
        ]
      },
      /* 对应表格接口
          * index	[string]	是	第几页
          * size	[string]	是	每页多少条
          * surnameName	[string]	是	姓氏
          * surnamePinyin	[string]	是	拼音（模糊匹配）
          * surnameStrokes	[string]	是	笔画数
          * */
      table: {
        data: [],
        param: {
          index: 1,
          size: 10,
          surnameName: '',
          surnamePinyin: '',
          surnameStrokes: ''
        },
        count: 0,
        selectArry: ''
      },
      /* 表格新增/修改相关
          * surnameName	[string]	是	姓氏
          * surnameStrokes	[number]	是	笔画数
          * surnameSort	[number]	是	排序
          * surnameEmblem	[string]	是	图腾
          * surnameRecommend	[string]	是	是否推荐【0-否、1-是】
          * */
      menuCtlData: {
        surnameName: '',
        surnameStrokes: '',
        surnameSort: '',
        surnameRecommend: ''
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
        index: 1,
        size: 10,
        surnameName: '',
        surnamePinyin: '',
        surnameStrokes: ''
      }
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
    },
    roleFormClose() {
      this.$refs['roleForm'].clearValidate()
    },
    addRoleBtn() {
      this.menuCtlData = {
        surnameName: '',
        surnameStrokes: '',
        surnameSort: '',
        surnameRecommend: '',
        surnameNameBase: ''
      }
      this.roleForm = this.menuCtlData
      this.menuControlTitle = '新增姓氏'
      this.formType = 1
      this.baseControlShow = true
    },
    editBase: function(row) {
      getFwSurnameById({ surnameId: row.SURNAME_ID }).then(res => {
        res.data.surnameNameBase = res.data.surnameName
        this.roleForm = res.data
        console.log(this.roleForm)
        this.menuControlTitle = '编辑姓氏'
        this.formType = 2
        this.baseControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('删除姓氏会删除姓氏的关联信息，是否删除姓氏 ' + row.SURNAME_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwSurnameById({ surnameId: row.SURNAME_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除姓氏' + row.SURNAME_NAME + '成功！',
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
            addFwSurname(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加姓氏' + SendObj.surnameName + '成功！',
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
            updateFwSurname(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改姓氏' + SendObj.surnameName + '成功！',
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
    fetchData() {
      this.tableLoading = true
      findFwSurname(this.table.param).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.SURNAME_RECOMMEND_NAME = (a.SURNAME_RECOMMEND === '0' ? '否' : '是')
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
  .centerBlps{
    max-height:55vh;
    .el-scrollbar {
      height: 55vh;
    }
  }
</style>
