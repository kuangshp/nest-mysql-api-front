<template>
  <div class="role">
    <div class="top-operation">
      <el-button @click="newDataHandle" type="primary">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="title" label="角色名称" width="180" align="right"></el-table-column>
      <el-table-column prop="description" label="描述" align="right"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.createdAt | formatDate}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="最后更新时间" width="180" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.updatedAt | formatDate}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="editRow(scope.row)" style="margin:0 10px;">编辑</el-button>
          <el-button size="mini" type="text" @click="deleteRow(scope.row)" style="margin:0 10px;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination :pageTotal="pageTotal" @handlePageChange="handlePageChange" />
    <role-modal ref="roleModal" @loadData="loadData"></role-modal>
  </div>
</template>

<script>
import RoleModal from './components/RoleModal';
import RoleService from '@/services/system/role';
import { formatDate } from "@/utils";
export default {
  data () {
    return {
      pageTotal: 0,
      tableData: []
    }
  },
  filters: {
    formatDate,
  },
  methods: {
    async initRoleList (param = {}) {
      const { code, message, result: { total, data } } = await RoleService.roleListApi(param);
      if (Object.is(code, 0)) {
        this.tableData = data;
        this.pageTotal = total;
      } else {
        console.error('获取角色列表失败', message);
      }
    },
    // 重新加载数据
    loadData () {
      this.initRoleList();
    },
    // 新增数据
    newDataHandle () {
      this.$refs.roleModal.openModal();
    },
    // 编辑行
    editRow (rowData) {
      this.$refs.roleModal.openModal(rowData);
    },
    deleteRow (rowData) {
      this.$confirm('确认删除？', {
        type: 'warning'
      }).then(async () => {
        const { code, message } = await RoleService.deleteRoleApi(rowData.id);
        if (Object.is(code, 0)) {
          this.$message.success(message);
          this.initRoleList();
        } else {
          this.$message.error(message);
        }
      })
    },
    // 分页
    handlePageChange (val) {
      console.log(val);
      this.initRoleList({ pageNumber: val });
    }
  },
  mounted () {
    this.initRoleList();
  },
  components: {
    RoleModal,
  }
}
</script>

<style lang="scss" scoped>
</style>