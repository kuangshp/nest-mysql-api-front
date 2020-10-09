<template>
  <div class="account">
    <div class="top-operation">
      <el-button @click="newDataHandle" type="primary">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180" align="right"></el-table-column>
      <el-table-column prop="roleStr" label="所属角色" align="right"></el-table-column>
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
    <account-modal ref="accountModal" @loadData="loadData"></account-modal>
  </div>
</template>

<script>
import AccountModal from './components/AccountModal';
import AccountService from '@/services/system/account';
import { formatDate } from '@/utils';
export default {
  data () {
    return {
      pageTotal: 0,
      tableData: [],
    }
  },
  filters: {
    formatDate,
  },
  methods: {
    async initAccountList (param = {}) {
      const { code, message, result: { total, data } } = await AccountService.accountListApi(param);
      if (Object.is(code, 0)) {
        this.pageTotal = total;
        this.tableData = data.map(item => {
          return {
            ...item,
            roleStr: item.roles.map(it => it.title).join(', ')
          }
        });
      } else {
        console.log('获取角色失败', message);
      }
    },
    newDataHandle () {
      this.$refs.accountModal.openModal();
    },
    editRow (rowData) {
      this.$refs.accountModal.openModal(rowData);
    },
    deleteRow (rowData) {
      this.$confirm('确定要删除吗?', {
        type: 'warning'
      }).then(async () => {
        const { code } = await AccountService.deleteAccountApi(rowData.id);
        if (Object.is(code, 0)) {
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败');
        }
      })
    },
    loadData () {
      this.initAccountList();
    },
    handlePageChange () { }
  },
  mounted () {
    this.initAccountList();
  },
  components: {
    AccountModal,
  }
}
</script>

<style lang="scss" scoped>
</style>