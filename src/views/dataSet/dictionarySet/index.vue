<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" :model="table.param" label-position="top" class="el-form-conts">
          <el-form-item label="字典类型名称">
            <el-input v-model="table.param.dictionaryClasszName" placeholder="通过字典类型搜索"/>
          </el-form-item>
          <el-form-item label="字典类型标识">
            <el-input v-model="table.param.dictionaryClasszCode" placeholder="通过字典类型标识搜索"/>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableControl">
        <el-button type="success" @click="addRoleBtn">新增字典类型</el-button>
      </div>
      <div v-loading="tableLoading" class="tableConts">
        <el-table
          v-loading="tableLoading"
          ref="dictionaryBaseTable"
          :data="table.data"
          :row-key="getRowKeys"
          :expand-row-keys="expands"
          border
          style="width: 100%"
          @expand-change="showDetail">
          <el-table-column type="expand" width="1" fixed class-name="showMoreUser">
            <template slot-scope="props">
              <div class="showRoleTouser">
                <dictionary-detail :key="props.row.DICTIONARY_CLASSZ_ID+'-tal'" :classid="props.row.DICTIONARY_CLASSZ_ID" :classname="props.row.DICTIONARY_CLASSZ_NAME"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="DICTIONARY_CLASSZ_NAME"
            label="字典类型名称"/>
          <el-table-column
            prop="DICTIONARY_CLASSZ_CODE"
            label="字典类型标识"/>
          <el-table-column
            prop="DICTIONARY_CLASSZ_SORT"
            label="排序"/>
          <el-table-column
            prop="CREATE_BY"
            label="创建人"/>
          <el-table-column
            prop="CREATE_DATE"
            label="创建时间"
            width="160"/>
          <el-table-column
            label="操作"
            width="130">
            <template slot-scope="scope">
              <div class="operationConts">
                <el-button type="text" size="small" title="字典类型编辑" @click="editBase(scope.row)"><svg-icon icon-class="editBtn" /></el-button>
                <el-button type="text" size="small" title="字典管理" @click="editDictionary(scope.row)"><svg-icon icon-class="form" /></el-button>
                <el-button type="text" size="small" title="删除字典类型" @click="deletMenu(scope.row)"><svg-icon icon-class="deletBtn" /></el-button>
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
          label="字典类型名称"
          prop="dictionaryClasszName"
          label-width="120px">
          <el-input v-model="roleForm.dictionaryClasszName"/>
        </el-form-item>
        <el-form-item
          label="字典类型标识"
          prop="dictionaryClasszCode"
          label-width="120px">
          <el-input v-model="roleForm.dictionaryClasszCode"/>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="dictionaryClasszSort"
          label-width="120px">
          <el-input v-model="roleForm.dictionaryClasszSort" type="number"/>
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
import DictionaryDetail from './DictionaryDetail'

export default {
  components: {
    pagination,
    DictionaryDetail
  },
  data: function() {
    var checkRoleCode = (rule, value, callback) => {
      console.log(2)
      if (value === '') {
        callback(new Error('请输入字典类型标识'))
      } else if (value !== this.roleForm.dictionaryClasszCodeBase) {
        isFwDictClasszOnly({ dictionaryClasszCode: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('字典类型标识已存在，请重新输入!'))
          }
        })
      } else {
        callback()
      }
    }

    return {
      rules: {
        dictionaryClasszName: [
          { required: true, message: '请输入字典类型名称', trigger: ['blur'] }
        ],
        dictionaryClasszCode: [
          { validator: checkRoleCode, trigger: 'blur' },
          { required: true, message: '请输入字典类型标识', trigger: ['blur'] }
        ],
        dictionaryClasszSort: [
          { required: true, message: '请输入字典类型排序', trigger: ['blur'] }
        ]
      },
      /* 对应表格接口
          * index	[string]	是	第几页
          * size	[string]	是	每页多少条
          * dictionaryClasszName	[string]	是	字典类型
          * surnamePinyin	[string]	是	拼音（模糊匹配）
          * surnameStrokes	[string]	是	笔画数
          * */
      table: {
        data: [],
        param: {
          index: 1,
          size: 10,
          dictionaryClasszName: '',
          dictionaryClasszCode: ''
        },
        count: 0,
        selectArry: ''
      },
      /* 表格新增/修改相关
          * dictionaryClasszCode	[string]	是	标识
          * dictionaryClasszName	[string]	是	名称
          * dictionaryClasszSort	[string]	是	排序
          * */
      menuCtlData: {
        dictionaryClasszCode: '',
        dictionaryClasszName: '',
        dictionaryClasszSort: ''
      },
      menuControlTitle: '',
      baseControlShow: false,
      menuControlShow: false,
      resControlShow: false,
      tableLoading: true,
      formType: 1,
      roleForm: {},
      /* 展开的行*/
      getRowKeys(row) {
        return row.DICTIONARY_CLASSZ_ID
      },
      expands: []
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    showDetail(data, expandedRows) {
      console.log(data, expandedRows)
      // 控制只显示当前行
      if (expandedRows.length) {
        this.expands = []
        if (data) {
          this.expands.push(data.DICTIONARY_CLASSZ_ID)
        }
      } else {
        this.expands = []
      }
    },
    handleSearch: function() {
      this.fetchData()
    },
    resetSearch: function() {
      this.table.param = {
        index: 1,
        size: 10,
        dictionaryClasszName: '',
        dictionaryClasszCode: ''
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
        dictionaryClasszCode: '',
        dictionaryClasszName: '',
        dictionaryClasszSort: ''
      }
      this.roleForm = this.menuCtlData
      this.menuControlTitle = '新增字典类型'
      this.formType = 1
      this.baseControlShow = true
    },
    editBase: function(row) {
      getFwDictClasszById({ dictionaryClasszId: row.DICTIONARY_CLASSZ_ID }).then(res => {
        res.data.dictionaryClasszCodeBase = res.data.dictionaryClasszCode
        this.roleForm = res.data
        console.log(this.roleForm)
        this.menuControlTitle = '编辑字典类型'
        this.formType = 2
        this.baseControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('删除字典类型会删除字典类型的关联信息，是否删除字典类型 ' + row.DICTIONARY_CLASSZ_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwDictClasszById({ dictionaryClasszId: row.DICTIONARY_CLASSZ_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除字典类型' + row.DICTIONARY_CLASSZ_NAME + '成功！',
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
    editDictionary(row) {
      this.$refs.dictionaryBaseTable.toggleRowExpansion(row)
    },
    roleFormAction() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          var SendObj = JSON.parse(JSON.stringify(this.roleForm))
          if (this.formType === 1) {
            addFwDictClassz(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加字典类型' + SendObj.dictionaryClasszName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
              this.roleForm = {
                dictionaryClasszCode: '',
                dictionaryClasszName: '',
                dictionaryClasszSort: ''
              }
            })
          } else {
            updateFwDictClassz(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改字典类型' + SendObj.dictionaryClasszName + '成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
              this.roleForm = {
                dictionaryClasszCode: '',
                dictionaryClasszName: '',
                dictionaryClasszSort: ''
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
      findFwDictClasszList(this.table.param).then(response => {
        this.table.data = response.data.listMapData
        this.table.count = response.data.count
        this.tableLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
  .centerBlps{
    max-height:55vh;
    .el-scrollbar {
      height: 55vh;
    }
  }
  .showMoreUser .el-icon{
    display: none;
  }
  .showRoleTouser{
    padding: 20px;
    background: #f4f4f5;
  }
</style>
