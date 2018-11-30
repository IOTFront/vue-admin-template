<template>
  <div class="app-container tableOutConts">
    <el-row>
      <el-col :sm="8" :md="10" :lg="6" :xl="5" class="hidden-xs-only">
        <LeftTree
          :key="thiTime+'table'"
          :searchtips="leftTree.searchTips"
          :treedate="leftTree.treeDate"
          :childrenstr="leftTree.childrenStr"
          :labelname="leftTree.labelName"
          :selectkey="leftTree.selectkey"
          :selectnode="leftTree.selectNode"
          :lefticon="leftTree.lefticon"
          @nodeclcik="treeNodeClick"
        />
      </el-col>
      <el-col :xs="24" :sm="16" :md="14" :lg="18" :xl="19" :key="thiTime+'table'" style="padding-left: 20px;">
        <div class="tableOutConts">
          <div class="searchPanel">
            <el-form :inline="true" :model="table.param" class="el-form-conts">
              <el-form-item label="名称">
                <el-input v-model="table.param.orgName" placeholder="通过名称搜索"/>
              </el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-form>
          </div>
          <div class="tableControl">
            <el-button type="success" @click="addMenuBtn">新增</el-button>
          </div>
          <div v-loading="tableLoading" class="tableConts">
            <el-table
              :data="table.data"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                fixed
                prop="ORG_NAME"
                label="机构名称"
                width="160"/>
              <el-table-column
                prop="ORG_SORT"
                label="机构排序" />
              <el-table-column
                prop="CREATE_DATE"
                label="创建时间"
                width="160"/>
              <el-table-column
                prop="CREATE_BY"
                label="创建人"/>
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
      </el-col>
    </el-row>

    <!--新增/修改弹出层-->
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600px" @close="orgManageFormClose">
      <el-form ref="orgManageForm" :model="orgManageForm" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          :rules="[ { required: true, message: '请输入机构名称', trigger: ['blur'] } ]"
          label="机构名称"
          prop="orgName"
          label-width="85px">
          <el-input v-model="orgManageForm.orgName"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true,type: 'number', message: '请输入排序数字', trigger: ['blur'] } ]"
          label="机构排序"
          prop="orgSort"
          label-width="85px">
          <el-input v-model.number="orgManageForm.orgSort" type="number"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="orgManageFormAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import LeftTree from '@/components/leftTree'
import { getFwOrgList, getFwOrgById, deleteFwOrgById, addFwOrg, getFwOrgListById, updateFwOrg } from '@/api/systemSet/organization'
import pagination from '@/components/pagination'
import iconSelect from '@/components/iconSelect'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'TreeTableDemo',
  components: { LeftTree, pagination, iconSelect },
  data() {
    return {
      thiTime: Date.parse(new Date()),
      /* 对应左边树图的参数
          * searchTips  ==>搜索栏提示语
          * treeDate    ==>树图数据
          * childrenStr ==>子节点数组对象名
          * labelName   ==>显示部分对应数据里的字段
          * selectkey   ==>树节点唯一标识 传入ID的key
          * selectNode  ==>树图加载时默认选中的节点
          * lefticon    ==>树图图标    不加图标直接设为空
          * */
      leftTree: {
        searchTips: '请输入要搜索的机构名',
        treeDate: [],
        childrenStr: 'CHILDREN',
        labelName: 'ORG_NAME',
        selectkey: 'ORG_ID',
        selectNode: '',
        lefticon: 'tree'
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
          orgId: '',
          orgName: '',
          index: 1,
          size: 10
        },
        count: 0,
        selectArry: ''
      },
      /* 表格新增/修改相关
          * orgParentId	[string]	是	父级机构ID,首节点为0
          * orgName	[string]	是	机构名称
          * orgSort	[number]	是	排序
          *
          * menuControlShow   模态框显示、隐藏
          * formType          模态框对应事件   1新增 2修改
          * */
      menuCtlData: {
        orgParentId: '',
        orgName: '',
        orgSort: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      tableLoading: true,
      formType: 1,
      orgManageForm: {}
    }
  },
  created() {
    /* 初始化加载树图*/
    this.reFlashLeftData('0')
  },
  methods: {
    /*  右侧表格事件
        * handleSearch            搜索按钮点击事件
        * getTypeValue            类型转换
        * handleSelectionChange   表格多选事件>>>>>>输出选中的表格列
        * addMenuBtn              表格对应添加按钮的事件   弹出模态框
        * pagerChange             对应表格下方分页 切换页 的事件
        * pagerSizeChange         对应表格下方分页 切换每页显示数量 的事件
        * fetchData               根据数据查询表格
        * orgManageFormAction           模态框提交确定按钮
        * */
    handleSearch: function() {
      this.fetchData()
    },
    getTypeValue: function(str) {
      let newStr = ''
      this.typeArry.forEach((a, b) => {
        if (a.value === str) {
          newStr = a.name
        }
      })
      return newStr
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
    orgManageFormClose() {
      this.$refs['orgManageForm'].clearValidate()
    },
    addMenuBtn() {
      this.menuCtlData = {
        orgParentId: this.table.param.orgId,
        orgName: '',
        orgSort: ''
      }
      this.orgManageForm = this.menuCtlData
      this.menuControlTitle = '新增机构'
      this.formType = 1
      this.menuControlShow = true
    },
    editMenu: function(row) {
      getFwOrgById({ orgId: row.ORG_ID }).then(res => {
        this.orgManageForm = res.data
        this.orgManageForm.resourceBasePath = this.orgManageForm.resourcePath
        this.menuControlTitle = '编辑机构'
        this.formType = 2
        this.menuControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('删除机构会删除下级所以机构及机构与角色的关系，是否删除机构 ' + row.ORG_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwOrgById({ orgId: row.ORG_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除机构' + row.ORG_NAME + '成功！',
              type: 'success'
            })
            this.reFlashLeftData(this.table.param.orgId)
          } else {
            this.$message.error(response.message)
          }
        })
      })
    },
    orgManageFormAction() {
      this.$refs['orgManageForm'].validate((valid) => {
        if (valid) {
          if (this.formType === 1) {
            addFwOrg(this.orgManageForm).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加机构' + this.orgManageForm.orgName + '成功！',
                  type: 'success'
                })
                this.reFlashLeftData(this.table.param.orgId)
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.$refs['orgManageForm'].clearValidate()
            })
          } else {
            updateFwOrg(this.orgManageForm).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改机构' + this.orgManageForm.orgName + '成功！',
                  type: 'success'
                })
                this.reFlashLeftData(this.table.param.orgId)
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.$refs['orgManageForm'].clearValidate()
            })
          }
        } else {
          this.$message.error('请按照提示信息修改错误的内容')
        }
      })
    },
    fetchData() {
      this.tableLoading = true
      getFwOrgListById(this.table.param).then(response => {
        this.table.data = response.data.listMapData
        this.table.count = response.data.count
        this.tableLoading = false
      })
    },
    /* 左侧树图methods
        *   treeNodeClick     树图点击事件>>>>加载右侧表格
        *   reFlashLeftData   重新加载树图
        * */
    treeNodeClick(id) {
      this.table.param.orgId = id
      this.fetchData()
    },
    reFlashLeftData(id) {
      this.table.param.orgId = id
      this.leftTree.selectNode = this.table.param.orgId
      getFwOrgList().then(response => {
        this.leftTree.treeDate = [{
          'ORG_ID': '0',
          'ORG_PARENT_ID': '',
          'ORG_NAME': '全部',
          'CHILDREN': response.data
        }]
        this.treeNodeClick(id)
      })
    }
  }
}
</script>
<style>

</style>
