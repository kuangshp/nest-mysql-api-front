<template>
  <div class="access">
    <div class="top-operation">
      <el-button @click="newDataHandle" type="primary">新增</el-button>
    </div>
    <el-table :data="tableList" style="width: 100%" row-key="id" border lazy :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="名称" width="180" align="left">
        <template slot-scope="scope">
          <template v-if="scope.row.moduleName">
            {{scope.row.moduleName}}
          </template>
          <template v-else>
            {{scope.row.actionName}}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="url地址" align="left"></el-table-column>
      <el-table-column prop="icon" label="图标" width="80" align="right"></el-table-column>
      <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.row)" style="margin:0 10px;">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination :pageTotal="pageTotal" @handlePageChange="handlePageChange" />
    <!-- 新增与编辑的弹框开始 -->
    <access-modal ref="dialog" @loadData="loadData" :menusList="tableList" />
    <!-- 新增与编辑的弹框结束 -->
  </div>
</template>

<script>
import AccessService from '@/services/system/access';
import AccessModal from './components/AccessModal';

export default {
  data () {
    return {
      pageTotal: 0,
      tableList: [],
    }
  },
  methods: {
    // 点击加载更多菜单
    async load (tree, treeNode, resolve) {
      const { data } = await this.getMenuList({ id: tree.id, limit: 100 });
      resolve(data)
    },
    // 统一请求数据
    async getMenuList (params) {
      let resultObj = {
        total: 0,
        data: []
      }
      try {
        const { code, message, result: { total, data } } = await AccessService.accessListApi(params);
        if (Object.is(code, 0)) {
          return Object.assign(resultObj, { total, data });
        } else {
          console.error('获取失败', message);
          return resultObj
        }
      } catch (error) {
        console.error(error);
        return resultObj;
      }
    },
    // 获取资源
    async initMenusList (params) {
      this.tableList = [];
      const { total, data } = await this.getMenuList(params);
      this.pageTotal = total;
      this.tableList = data.map(item => {
        return { ...item, hasChildren: true };
      });
    },
    // 编辑按钮
    handleEdit (rowData) {
      this.$refs.dialog.openDialog(rowData);
    },
    // 删除按钮
    async handleDelete (rowData) {
      this.$confirm('确认删除？', {
        type: 'warning'
      }).then(async () => {
        const { code, message } = await AccessService.deleteAccessApi(rowData.id);
        if (Object.is(code, 0)) {
          this.$message.success(message);
          this.initMenusList({ pageNumber: 1 });
        } else {
          this.$message.error(message);
        }
      })
    },
    // 修改分页
    handlePageChange (val) {
      this.initMenusList({ pageNumber: val });
    },
    // 成功后刷新数据
    loadData () {
      this.initMenusList({ pageNumber: 1 });
    },
    // 新增按钮
    newDataHandle () {
      this.$refs.dialog.openDialog({}, true);
    }
  },
  mounted () {
    this.initMenusList({ pageNumber: 1 });
  },
  components: {
    AccessModal,
  }
}
</script>

<style lang="scss" scoped>
</style>