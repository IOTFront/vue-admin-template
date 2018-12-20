<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="tableControl">
        <el-button type="success" size="mini" @click="addRoleBtn">新增字典</el-button>
      </div>
      <div class="tableConts">
        <el-table
          v-loading="R2UtableLoading"
          :data="table.data"
          :key="classid+'tanleOl'"
          border
          height="235"
          style="width: 100%">
          <el-table-column
            prop="DICTIONARY_NAME"
            label="名称"/>
          <el-table-column
            prop="DICTIONARY_CODE"
            label="标识"/>
          <el-table-column
            prop="DICTIONARY_SORT"
            label="排序"/>
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
                <el-button type="text" size="small" title="字典编辑" @click="editBase(scope.row)"><svg-icon icon-class="editBtn" /></el-button>
                <el-button type="text" size="small" title="删除字典" @click="deletMenu(scope.row)"><svg-icon icon-class="deletBtn" /></el-button>
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
            @pagersizechange="pagerSizeChange"
            @pagerchange="pagerChange"/>
        </div>
      </div>
    </div>
    <!--新增/修改弹出层-->
    <el-dialog :title="menuControlTitle" :visible.sync="baseControlShow" width="600px" @close="roleFormClose">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          label="字典名称"
          prop="dictionaryName"
          label-width="85px">
          <el-input v-model="roleForm.dictionaryName"/>
        </el-form-item>
        <el-form-item
          label="字典标识"
          prop="dictionaryCode"
          label-width="85px">
          <el-input v-model="roleForm.dictionaryCode"/>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="dictionarySort"
          label-width="85px">
          <el-input v-model="roleForm.dictionarySort" type="number"/>
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
import { isFwDictClasszOnly, addFwDictClassz, deleteFwDictClasszById, updateFwDictClassz, getFwDictClasszById, findFwDictClasszList, addFwDict, deleteFwDictById, updateFwDict, getFwDictById, getFwDictListByCode, findFwDictList, deleteBatchFwDict } from '@/api/dataSet/dictionarySet'
import pagination from '@/components/pagination'

export default {
  name: 'DictionaryDetail',
  components: {
    pagination
  },
  props: {
    classid: {
      type: String,
      required: true
    },
    classname: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      rules: {
        dictionaryCode: [
          { required: true, message: '请输入字典标识', trigger: ['blur'] }
        ],
        dictionaryName: [
          { required: true, message: '请输入字典名称', trigger: ['blur'] }
        ],
        dictionarySort: [
          { required: true, message: '请输入字典排序', trigger: ['blur'] }
        ]
      },
      /* 对应表格接口
          * index	[string]	是	第几页
          * size	[string]	是	每页多少条
          * dictionaryClasszId	[string]	是	字典分类Id,0为查询全部
          * dictionaryName	[string]	是	名称
          * dictionaryCode	[string]	是	标识
          * */
      table: {
        data: [],
        param: {
          index: 1,
          size: 5,
          dictionaryClasszId: this.classid,
          dictionaryName: '',
          dictionaryCode: ''
        },
        count: 0
      },
      /* 表格新增/修改相关
          * dictionaryClasszId	[string]	是	所属字典分类ID
          * dictionaryCode	[string]	是	字典标识
          * dictionaryName	[string]	是	字典名称
          * dictionarySort	[string]	是	排序
          * */
      menuCtlData: {
        dictionaryClasszId: this.classid,
        dictionaryCode: '',
        dictionaryName: '',
        dictionarySort: ''
      },
      menuControlTitle: '',
      baseControlShow: false,
      menuControlShow: false,
      resControlShow: false,
      R2UtableLoading: true,
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
        size: 5,
        dictionaryClasszId: this.classid,
        dictionaryCode: '',
        dictionaryName: '',
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
        dictionaryClasszId: this.classid,
        dictionaryCode: '',
        dictionaryName: '',
        dictionarySort: ''
      }
      this.roleForm = this.menuCtlData
      this.menuControlTitle = '新增字典'
      this.formType = 1
      this.baseControlShow = true
    },
    editBase: function(row) {
      getFwDictById({ dictionaryId: row.DICTIONARY_ID }).then(res => {
        this.roleForm = res.data
        this.menuControlTitle = '编辑字典'
        this.formType = 2
        this.baseControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('是否删除字典 ' + row.DICTIONARY_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwDictById({ dictionaryId: row.DICTIONARY_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除字典' + row.DICTIONARY_NAME + '成功！',
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
    roleFormAction() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          var SendObj = JSON.parse(JSON.stringify(this.roleForm))
          if (this.formType === 1) {
            addFwDict(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加字典' + SendObj.dictionaryName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
              this.roleForm = {
                dictionaryClasszId: this.classid,
                dictionaryCode: '',
                dictionaryName: '',
                dictionarySort: ''
              }
            })
          } else {
            updateFwDict(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改字典' + SendObj.dictionaryName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
              this.roleForm = {
                dictionaryClasszId: this.classid,
                dictionaryCode: '',
                dictionaryName: '',
                dictionarySort: ''
              }
            })
          }
        } else {
          this.$message.error('请按照提示信息修改错误的内容')
        }
      })
    },
    fetchData() {
      this.R2UtableLoading = true
      findFwDictList(this.table.param).then(response => {
        this.table.data = response.data.listMapData
        this.table.count = response.data.count
        this.R2UtableLoading = false
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
