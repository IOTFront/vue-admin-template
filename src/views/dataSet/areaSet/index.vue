<template>
  <div class="app-container">
    <div class="tableOutConts">
      <div class="searchPanel">
        <el-form :inline="true" label-position="top" class="el-form-conts">
          <el-form-item label="区划名称">
            <el-select
              v-model="table.paramNext.regionId"
              :remote-method="remoteMethod"
              :loading="searchLoading"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词">
              <el-option
                v-for="item in searchData"
                :key="item.REGION_ID"
                :label="item.REGION_NAME"
                :value="item.REGION_ID"/>
            </el-select>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableControl">
        <el-button type="success" @click="addAreaBtn">新增</el-button>
      </div>
      <div v-loading="tableLoading" class="tableConts">
        <tree-table
          ref="treeTableOut"
          :data="table.data"
          :columns="columns"
          border
          @getselecttd="getSelectThisn">
          <el-table-column
            fixed="right"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <div class="operationConts">
                <el-button type="text" size="small" title="区划编辑" @click="editBase(scope.row)"><svg-icon icon-class="editBtn" /></el-button>
                <el-button type="text" size="small" title="删除区划" @click="deletMenu(scope.row)"><svg-icon icon-class="deletBtn" /></el-button>
              </div>
            </template>
          </el-table-column>
        </tree-table>
      </div>
    </div>

    <!--新增/修改弹出层-->
    <el-dialog :title="menuControlTitle" :visible.sync="baseControlShow" width="600px" @close="roleFormClose">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          label="上级区划"
          label-width="85px">
          <span>{{ roleForm.regionParentName }}</span>
        </el-form-item>
        <el-form-item
          label="区划名称"
          prop="regionName"
          label-width="85px">
          <el-input v-model="roleForm.regionName"/>
        </el-form-item>
        <el-form-item
          label="区划类型"
          prop="regionType"
          label-width="85px">
          <el-select
            v-model="roleForm.regionType"
            style="width: 100%;"
            placeholder="请选择">
            <el-option label="国家" value="1"/>
            <el-option label="省份" value="2"/>
            <el-option label="城市" value="3"/>
            <el-option label="县区" value="4"/>
            <el-option label="街道" value="5"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="regionSort"
          label-width="85px">
          <el-input v-model="roleForm.regionSort" type="number"/>
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
import { isFwRegionOnly, loadRegionInfo, getFwRegion, getFwRegionLower, getFwRegionLowerAll, getFwRegionQuery, addFwRegionOn, deleteFwRegionById, updateFwRegion, getFwRegionUpper } from '@/api/dataSet/areaSet'
import treeTable from './TreeTable'
import Json2Tree from '@/utils/tool'
export default {
  name: 'AreaTreeTable',
  components: { treeTable },
  data() {
    return {
      rules: {
        regionParentId: [
          { required: true, message: '请选择上级行政区划', trigger: ['blur'] }
        ],
        regionName: [
          { required: true, message: '请输入区划名称', trigger: ['blur'] }
        ],
        regionType: [
          { required: true, message: '请选择区划类型', trigger: ['blur'] }
        ],
        regionSort: [
          { required: true, message: '请输入区划排序', trigger: ['blur'] }
        ]
      },
      columns: [
        {
          text: '区划名称',
          value: 'REGION_NAME'
        },
        {
          text: '区划排序',
          value: 'REGION_SORT'
        },
        {
          text: '区划类型',
          value: 'REGION_TYPE_NAME'
        }
      ],
      table: {
        param: {
          regionId: 0
        },
        paramNext: {
          regionId: ''
        },
        data: []
      },
      /* 表格新增/修改相关
          * regionParentId	[string]	是	父级ID，首节点为0
          * regionName	[string]	是	区划名称，需验证是否可用
          * regionType	[string]	是	类型【1-国家、2-省份、3-城市、4-县区、5-街道】，自动获取上级类型+1
          * regionSort	[string]	是	排序
          * */
      menuCtlData: {
        regionParentId: '',
        regionName: '',
        regionType: '',
        regionSort: ''
      },
      selectObj: {},
      searchData: [],
      searchLoading: false,
      tableLoading: true,
      baseControlShow: false,
      menuControlTitle: '',
      menuControlShow: false,
      resControlShow: false,
      formType: 1,
      roleForm: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      getFwRegionLower(this.table.param).then(response => {
        response.data.forEach((a, b) => {
          if (a.children === undefined) {
            a.children = []
          }
        })
        this.resetData(response.data)
        this.table.data = response.data
        this.tableLoading = false
      })
    },
    resetData(data, searchBol) {
      data.forEach((a, b) => {
        var typeName = ['暂无', '国家', '省份', '城市', '县区', '街道']
        a.REGION_TYPE_NAME = typeName[a.REGION_TYPE]
        if (searchBol) {
          a.show = true
          a._expanded = true
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        getFwRegionQuery({
          regionName: query
        }).then(response => {
          this.searchData = response.data
          this.searchLoading = false
        })
      } else {
        this.searchData = []
      }
    },
    handleSearch() {
      this.tableLoading = true
      this.selectObj = {}
      getFwRegionUpper(this.table.paramNext).then(response => {
        this.resetData(response.data, true)
        this.table.data = Json2Tree(response.data, 'REGION_ID', 'REGION_PARENT_ID', 'children')
        this.tableLoading = false
        this.$nextTick(() => {
          var getTreeTable = this.$refs.treeTableOut.$refs.treeTable
          getTreeTable.setCurrentRow(getTreeTable.data[getTreeTable.data.length - 1])
          console.log(getTreeTable)
        })
      })
    },
    resetSearch() {
      this.table.param = {
        regionId: 0
      }
      this.selectObj = {}
      this.fetchData()
    },
    roleFormClose() {
      this.$refs['roleForm'].clearValidate()
    },
    addAreaBtn() {
      if (this.selectObj.REGION_ID === undefined) {
        this.menuCtlData = {
          regionParentId: '0',
          regionName: '',
          regionType: '',
          regionSort: '',
          regionParentName: '无'
        }
      } else {
        this.menuCtlData = {
          regionParentId: this.selectObj.REGION_ID,
          regionName: '',
          regionType: '',
          regionSort: '',
          regionParentName: this.selectObj.REGION_NAME
        }
      }

      this.roleForm = this.menuCtlData
      this.menuControlTitle = '新增区划'
      this.formType = 1
      this.baseControlShow = true
    },
    editBase: function(row) {
      var parentName = '无'
      if (row.parent) {
        parentName = row.parent.REGION_NAME
      }
      console.log(row)
      getFwRegion({ regionId: row.REGION_ID }).then(res => {
        res.data.regionParentName = parentName
        this.roleForm = res.data
        this.menuControlTitle = '编辑区划'
        this.formType = 2
        this.baseControlShow = true
      })
    },
    getSelectThisn(row) {
      this.selectObj = row
    },
    deletMenu(row) {
      console.log(row)
      this.$confirm('删除区划会删除区划的关联信息，是否删除区划 ' + row.REGION_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwRegionById({ regionId: row.REGION_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除区划' + row.REGION_NAME + '成功！',
              type: 'success'
            })
            if (row.parent === undefined) {
              this.fetchData()
            } else {
              this.upDateRow(row.parent)
            }
          } else {
            this.$message.error(response.message)
          }
        }).catch(() => {
        })
      })
    },
    upDateRow(row) {
      getFwRegionLower({ regionId: row.REGION_ID }).then(response => {
        response.data.forEach((a, b) => {
          if (a.children === undefined) {
            a.children = []
          }
        })
        this.resetData(response.data)
        row.children = response.data
        row.REGION_LOWER_SIZE++
      })
    },
    roleFormAction() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          var SendObj = JSON.parse(JSON.stringify(this.roleForm))
          if (this.formType === 1) {
            addFwRegionOn(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加区划' + SendObj.regionName + '成功！',
                  type: 'success'
                })
                if (this.selectObj.REGION_ID === undefined) {
                  this.fetchData()
                } else {
                  this.upDateRow(this.selectObj)
                }
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
              this.roleForm = {
                regionParentId: '',
                regionName: '',
                regionType: '',
                regionSort: ''
              }
            })
          } else {
            updateFwRegion(SendObj).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改区划' + SendObj.regionName + '成功！',
                  type: 'success'
                })
                this.selectObj.REGION_NAME = SendObj.regionName
                this.selectObj.REGION_SORT = SendObj.regionSort
                var typeName = ['暂无', '国家', '省份', '城市', '县区', '街道']
                this.selectObj.REGION_TYPE = SendObj.regionType
                this.selectObj.REGION_TYPE_NAME = typeName[SendObj.regionType]
              } else {
                this.$message.error(res.message)
              }
              this.baseControlShow = false
              this.roleForm = {
                regionParentId: '',
                regionName: '',
                regionType: '',
                regionSort: ''
              }
            })
          }
        } else {
          this.$message.error('请按照提示信息修改错误的内容')
        }
      })
    }
  }
}
</script>

