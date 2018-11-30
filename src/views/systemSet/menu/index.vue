<template>
  <div class="app-container tableOutConts">
    <el-row>
      <el-col :sm="8" :md="6" :lg="4" :xl="3" class="hidden-xs-only">
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
      <el-col :xs="24" :sm="16" :md="18" :lg="20" :xl="21" :key="thiTime+'table'" style="padding-left: 20px;">
        <div class="tableOutConts">
          <div class="searchPanel">
            <el-form :inline="true" :model="table.param" class="el-form-conts">
              <el-form-item label="名称">
                <el-input v-model="table.param.menuName" placeholder="通过名称搜索"/>
              </el-form-item>
              <el-form-item label="链接">
                <el-input v-model="table.param.menuPath" placeholder="通过链接搜索"/>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="table.param.menuType" clearable placeholder="请选择类型">
                  <el-option label="菜单" value="0"/>
                  <el-option label="按钮" value="1"/>
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
                prop="MENU_NAME"
                label="菜单名称"
                width="120"/>
              <el-table-column
                label="图标">
                <template slot-scope="scope">
                  <div style="text-align: center">
                    <svg-icon :icon-class="scope.row.MENU_ICON" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="MENU_PATH"
                label="链接"
                width="200"/>
              <el-table-column
                prop="MENU_TYPE_NAME"
                label="类型" />
              <el-table-column
                prop="CREATE_BY"
                label="创建人"/>
              <el-table-column
                prop="CREATE_DATE"
                label="创建时间"
                width="160"/>
              <el-table-column
                prop="MENU_SORT"
                label="排序"/>
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
    <el-dialog :title="menuControlTitle" :visible.sync="menuControlShow" width="600" @close="menuFormClose">
      <el-form ref="menuForm" :model="menuForm" label-position="left" label-width="70px" style="padding: 0 20px;">
        <el-form-item
          :rules="[ { required: true, message: '请输入菜单名称', trigger: ['blur'] } ]"
          label="菜单名称"
          prop="menuName"
          label-width="85px">
          <el-input v-model="menuForm.menuName"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请选择菜单图标', trigger: ['blur'] } ]"
          label="菜单图标"
          prop="menuIcon"
          label-width="85px">
          <iconSelect :selecticon="menuForm.menuIcon" style="width: 100%;" @iconchange="formIcon"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请输入菜单链接地址', trigger: ['blur'] } ]"
          label="链接地址"
          prop="menuPath"
          label-width="85px">
          <el-input v-model="menuForm.menuPath"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true,type: 'number', message: '请输入排序数字', trigger: ['blur'] } ]"
          label="菜单排序"
          prop="menuSort"
          label-width="85px">
          <el-input v-model.number="menuForm.menuSort" type="number"/>
        </el-form-item>
        <el-form-item
          :rules="[ { required: true, message: '请选择菜单类型', trigger: ['blur'] } ]"
          label="菜单类型"
          prop="menuType"
          label-width="85px">
          <el-select
            v-model="menuForm.menuType"
            style="width: 100%;"
            placeholder="请选择类型">
            <el-option label="菜单" value="0"/>
            <el-option label="按钮" value="1"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuControlShow = false;">取 消</el-button>
        <el-button type="primary" @click="menuFormAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import LeftTree from '@/components/leftTree'
import { getMenuTree, getMenuList, delMenuById, creatMenu, getFwMenuById, updateFwMenu } from '@/api/systemSet/menu'
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
      * searchTips  ===>搜索栏提示语
      * treeDate    ==>树图数据
      * childrenStr ==>子节点数组对象名
      * labelName   ==>显示部分对应数据里的字段
      * selectkey   ==>树节点唯一标识 传入ID的key
      * selectNode  ==>树图加载时默认选中的节点
      * lefticon    ==>树图图标    不加图标直接设为空
      * */
      leftTree: {
        searchTips: '请输入要搜索的菜单名',
        treeDate: [],
        childrenStr: 'CHILDREN',
        labelName: 'MENU_NAME',
        selectkey: 'MENU_ID',
        selectNode: '',
        lefticon: 'menuIcon'
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
          menutId: '',
          menuName: '',
          menuPath: '',
          menuType: '',
          index: 1,
          size: 10
        },
        count: 0,
        selectArry: ''
      },
      /* 表格新增/修改相关
      * menuParentId	[string]	是	父级菜单ID,根节点为0
      * menuName	[string]	是	名称
      * menuSort	[number]	是	排序
      * menuType	[string]	是	类型【0-菜单、1-按钮】
      * menuPath	[string]	是	链接地址
      * menuIcon	[string]	是	图标
      *
      * menuControlShow   模态框显示、隐藏
      * formType          模态框对应事件   1新增 2修改
      * */
      menuCtlData: {
        menuParentId: '',
        menuName: '',
        menuSort: '',
        menuType: '',
        menuPath: '',
        menuIcon: ''
      },
      menuControlTitle: '',
      menuControlShow: false,
      tableLoading: true,
      formType: 1,
      menuForm: {}
    }
  },
  created() {
    /* 初始化加载树图*/
    this.reFlashLeftData('0')
  },
  methods: {
    /*  右侧表格事件
    * handleSearch            搜索按钮点击事件
    * handleSelectionChange   表格多选事件>>>>>>输出选中的表格列
    * addMenuBtn              表格对应添加按钮的事件   弹出模态框
    * pagerChange             对应表格下方分页 切换页 的事件
    * pagerSizeChange         对应表格下方分页 切换每页显示数量 的事件
    * fetchData               根据数据查询表格
    * menuFormAction           模态框提交确定按钮
    * */
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
    menuFormClose() {
      this.$refs['menuForm'].clearValidate()
      this.menuForm.menuIcon = ''
    },
    addMenuBtn() {
      this.menuCtlData = {
        menuParentId: this.table.param.menutId,
        menuName: '',
        menuSort: '',
        menuType: '',
        menuPath: '',
        menuIcon: ''
      }
      this.menuForm = this.menuCtlData
      this.menuControlTitle = '新增菜单'
      this.formType = 1
      this.menuControlShow = true
    },
    editMenu: function(row) {
      getFwMenuById({ menuId: row.MENU_ID }).then(res => {
        this.menuForm = res.data
        this.menuControlTitle = '编辑菜单'
        this.formType = 2
        this.menuControlShow = true
      })
    },
    deletMenu(row) {
      this.$alert('删除菜单同时会删除下级的菜单，是否删除菜单' + row.MENU_NAME + '?', '删除提示', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: action => {
          delMenuById({ menuId: row.MENU_ID }).then(response => {
            if (response.data) {
              this.$message({
                message: '恭喜你，删除菜单' + row.MENU_NAME + '成功！',
                type: 'success'
              })
              this.reFlashLeftData(this.table.param.menutId)
            } else {
              this.$message.error(response.message)
            }
          })
        }
      })
    },
    formIcon: function(icon) {
      this.menuForm.menuIcon = icon
    },
    menuFormAction() {
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          if (this.formType === 1) {
            creatMenu(this.menuForm).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，添加菜单' + this.menuForm.menuName + '成功！',
                  type: 'success'
                })
                this.reFlashLeftData(this.table.param.menutId)
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.$refs['menuForm'].clearValidate()
            })
          } else {
            updateFwMenu(this.menuForm).then(res => {
              if (res.data) {
                this.$message({
                  message: '恭喜你，修改菜单' + this.menuForm.menuName + '成功！',
                  type: 'success'
                })
                this.reFlashLeftData(this.table.param.menutId)
              } else {
                this.$message.error(res.message)
              }
              this.menuControlShow = false
              this.$refs['menuForm'].clearValidate()
            })
          }
        } else {
          this.$message.error('请按照提示信息修改错误的内容')
        }
      })
    },
    fetchData() {
      this.tableLoading = true
      getMenuList(this.table.param).then(response => {
        response.data.listMapData.forEach((a, b) => {
          a.MENU_TYPE_NAME = (a.MENU_TYPE === '0' ? '菜单' : '按钮')
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
      console.log(id)
      this.table.param.menutId = id
      this.fetchData()
    },
    reFlashLeftData(id) {
      this.table.param.menutId = id
      this.leftTree.selectNode = this.table.param.menutId
      getMenuTree().then(response => {
        this.leftTree.treeDate = [{
          'MENU_ID': '0',
          'MENU_PARENT_ID': '',
          'MENU_NAME': '全部',
          'CHILDREN': response.data
        }]
        this.treeNodeClick(id)
      })
    }
  }
}
</script>

