<template>
  <div class="app-container tableOutConts">

    <div class="tableControl">
      <el-button type="success" round>新增</el-button>
    </div>
    <div class="tableConts">
      <tree-table :data="data" :columns="columns" :eval-args="args" :expand-all="expandAll" border>
        <el-table-column label="图标" width="100">
          <template slot-scope="scope">
            <div style="text-align: center">
              <svg-icon icon-class="home" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="链接">
          <template slot-scope="scope">
            <div>/user/home</div>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <div>首页、、擦擦十分大方&gt;</div>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="message(scope.row)">上移</el-button>
            <el-button type="text" @click="message(scope.row)">下移</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" @click="message(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'

export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      expandAll: true,
      columns: [
        {
          text: '名称',
          value: 'event',
          width: 200
        }
      ],
      data: [
        {
          id: 0,
          event: '事件1',
          timeLine: 50,
          comment: '无'
        },
        {
          id: 1,
          event: '事件1',
          timeLine: 100,
          comment: '无',
          children: [
            {
              id: 2,
              event: '事件2',
              timeLine: 10,
              comment: '无'
            },
            {
              id: 3,
              event: '事件3',
              timeLine: 90,
              comment: '无',
              children: [
                {
                  id: 4,
                  event: '事件4',
                  timeLine: 5,
                  comment: '无'
                },
                {
                  id: 5,
                  event: '事件5',
                  timeLine: 10,
                  comment: '无'
                },
                {
                  id: 6,
                  event: '事件6',
                  timeLine: 75,
                  comment: '无',
                  children: [
                    {
                      id: 7,
                      event: '事件7',
                      timeLine: 50,
                      comment: '无',
                      children: [
                        {
                          id: 71,
                          event: '事件71',
                          timeLine: 25,
                          comment: 'xx'
                        },
                        {
                          id: 72,
                          event: '事件72',
                          timeLine: 5,
                          comment: 'xx'
                        },
                        {
                          id: 73,
                          event: '事件73',
                          timeLine: 20,
                          comment: 'xx'
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: '事件8',
                      timeLine: 25,
                      comment: '无'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      args: [null, null, 'timeLine']
    }
  },
  methods: {
    message(row) {
      this.$message.info(row.event)
    }
  }
}
</script>
