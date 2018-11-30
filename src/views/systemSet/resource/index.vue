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
                <el-input v-model="table.param.resourceName" placeholder="通过名称搜索"/>
              </el-form-item>
              <el-form-item label="链接">
                <el-input v-model="table.param.resourcePath" placeholder="通过链接搜索"/>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="table.param.resourceType" clearable placeholder="请选择类型">
                  <el-option label="数据请求" value="GET"/>
                  <el-option label="表单提交" value="POST"/>
                  <el-option label="数据修改" value="PUT"/>
                  <el-option label="数据删除" value="DELETE"/>
                  <el-option label="上传" value="UPLOAD"/>
                  <el-option label="下载" value="DOWNLOAD"/>
                </el-select>
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
                prop="RESOURCE_NAME"
                label="资源名称"
                width="160"/>
              <el-table-column
                prop="RESOURCE_TYPE_NAME"
                label="资源类型"/>
              <el-table-column
                prop="RESOURCE_PATH"
                label="资源链接"
                width="240"
                class-name="nowarp"/>
              <el-table-column
                prop="RESOURCE_SORT"
                label="资源排序" />
              <el-table-column
                prop="RESOURCE_DESC"
                label="资源描述"
                width="100"
                class-name="nowarp"/>
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
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600px" @close="resFormClose">
      <el-form ref="resForm" :model="resForm" :rules="rules" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          :rules="[ { required: true, message: '请输入资源名称', trigger: ['blur'] } ]"
          label="资源名称"
          prop="resourceName"
          label-width="85px">
          <el-input v-model="resForm.resourceName"/>
        </el-form-item>
        <el-form-item
          label="资源链接"
          prop="resourcePath"
          label-width="85px">
          <el-input v-model="resForm.resourcePath"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请选择资源类型', trigger: ['blur'] } ]"
          label="资源类型"
          prop="resourceType"
          label-width="85px">
          <el-select
            v-model="resForm.resourceType"
            style="width: 100%;"
            placeholder="请选择类型">
            <el-option label="数据请求" value="GET"/>
            <el-option label="表单提交" value="POST"/>
            <el-option label="数据修改" value="PUT"/>
            <el-option label="数据删除" value="DELETE"/>
            <el-option label="上传" value="UPLOAD"/>
            <el-option label="下载" value="DOWNLOAD"/>
          </el-select>
        </el-form-item>        <el-form-item
          :rules="[ { required: true,type: 'number', message: '请输入排序数字', trigger: ['blur'] } ]"
          label="资源排序"
          prop="resourceSort"
          label-width="85px">
          <el-input v-model.number="resForm.resourceSort" type="number"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请输入资源描述', trigger: ['blur'] } ]"
          label="资源描述"
          prop="resourceDesc"
          label-width="85px">
          <el-input v-model="resForm.resourceDesc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="resFormAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import LeftTree from '@/components/leftTree'
import { isFwResOnly, addFwRes, deleteFwResById, updateFwRes, getFwResById, getFwResList, findFwResList } from '@/api/systemSet/rescourse'
import pagination from '@/components/pagination'
import iconSelect from '@/components/iconSelect'
import 'element-ui/lib/theme-chalk/display.css'

export default {
  name: 'TreeTableDemo',
  components: { LeftTree, pagination, iconSelect },
  data() {
    var validateResUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入资源名称'))
      } else if (value !== this.resForm.resourceBasePath) {
        isFwResOnly({ resourcePath: value }).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('资源链接已存在，请重新输入!'))
          }
        })
      } else {
        callback()
      }
    }
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
        searchTips: '请输入要搜索的资源名',
        treeDate: [],
        childrenStr: 'CHILDREN',
        labelName: 'RESOURCE_NAME',
        selectkey: 'RESOURCE_ID',
        selectNode: '',
        lefticon: 'res'
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
          resourceId: '',
          resourceName: '',
          resourcePath: '',
          resourceType: '',
          index: 1,
          size: 10
        },
        count: 0,
        selectArry: ''
      },
      /* 数据转换表单*/
      typeArry: [
        { name: '数据请求', value: 'GET' },
        { name: '表单提交', value: 'POST' },
        { name: '数据修改', value: 'PUT' },
        { name: '数据删除', value: 'DELETE' },
        { name: '上传', value: 'UPLOAD' },
        { name: '下载', value: 'DOWNLOAD' }
      ],
      /* 表格新增/修改相关
        * resourceParentId	[string]	是	父级资源ID,首节点为0
        * resourcePath	[string]	是	资源链接
        * resourceName	[string]	是	名称
        * resourceType	[string]	是	类型【GET-数据请求、POST-表单提交、PUT-数据修改、DELETE-数据删除、UPLOAD-上传、DOWNLOAD-下载】
        * resourceSort	[number]	是	排序
        * resourceDesc	[string]	是	描述
        *
        * menuControlShow   模态框显示、隐藏
        * formType          模态框对应事件   1新增 2修改
        * */
      menuCtlData: {
        resourceParentId: '',
        resourcePath: '',
        resourceName: '',
        resourceType: '',
        resourceSort: '',
        resourceDesc: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      tableLoading: true,
      formType: 1,
      resForm: {},
      rules: {
        resourcePath: [
          { validator: validateResUrl, trigger: 'blur' },
          { required: true, message: '请输入资源链接', trigger: ['blur'] }
        ]
      }
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
      * resFormAction           模态框提交确定按钮
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
    resFormClose() {
      this.$refs['resForm'].clearValidate()
    },
    addMenuBtn() {
      this.menuCtlData = {
        resourceParentId: this.table.param.resourceId,
        resourcePath: '',
        resourceName: '',
        resourceType: '',
        resourceSort: '',
        resourceDesc: '',
        resourceBasePath: ''
      }
      this.resForm = this.menuCtlData
      this.menuControlTitle = '新增资源'
      this.formType = 1
      this.menuControlShow = true
    },
    editMenu: function(row) {
      getFwResById({ resourceId: row.RESOURCE_ID }).then(res => {
        this.resForm = res.data
        this.resForm.resourceBasePath = this.resForm.resourcePath
        this.menuControlTitle = '编辑资源'
        this.formType = 2
        this.menuControlShow = true
      })
    },
    deletMenu(row) {
      this.$confirm('删除资源会删除下级所以资源及资源与角色的关系，是否删除资源 ' + row.RESOURCE_NAME + ' ?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFwResById({ resourceId: row.RESOURCE_ID }).then(response => {
          if (response.data) {
            this.$message({
              message: '恭喜你，删除资源' + row.RESOURCE_NAME + '成功！',
              type: 'success'
            })
            this.reFlashLeftData(this.table.param.resourceId)
          } else {
            this.$message.error(response.message)
          }
        })
      })
    },
    resFormAction() {
      this.$refs['resForm'].validate((valid) => {
        if (valid) {
          if (this.formType === 1) {
            addFwRes(this.resForm).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加资源' + this.resForm.resourceName + '成功！',
                  type: 'success'
                })
                this.reFlashLeftData(this.table.param.resourceId)
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.$refs['resForm'].clearValidate()
            })
          } else {
            updateFwRes(this.resForm).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改资源' + this.resForm.resourceName + '成功！',
                  type: 'success'
                })
                this.reFlashLeftData(this.table.param.resourceId)
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.$refs['resForm'].clearValidate()
            })
          }
        } else {
          this.$message.error('请按照提示信息修改错误的内容')
        }
      })
    },
    fetchData() {
      this.tableLoading = true
      findFwResList(this.table.param).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.RESOURCE_TYPE_NAME = this.getTypeValue(a.RESOURCE_TYPE)
        })
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
      this.table.param.resourceId = id
      this.fetchData()
    },
    reFlashLeftData(id) {
      this.table.param.resourceId = id
      this.leftTree.selectNode = this.table.param.resourceId
      getFwResList().then(response => {
        this.leftTree.treeDate = [{
          'RESOURCE_ID': '0',
          'RESOURCE_PARENT_ID': '',
          'RESOURCE_NAME': '全部',
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
