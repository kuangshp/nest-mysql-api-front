<template>
  <div class="dict">
    <div class="top-operation">
      <el-button @click="newDataHandle" type="primary">新增字典</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
      <el-table-column prop="label" label="Label值" align="right"></el-table-column>
      <el-table-column prop="category" label="分类" align="right"></el-table-column>
      <el-table-column prop="description" label="描素" align="right"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.createdAt | formatDate}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="180" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.updatedAt | formatDate}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="editRow(scope.row)" style="margin:0 10px;">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteRow(scope.row)" style="margin:0 10px;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination :pageTotal="tableTotal" @handlePageChange="handlePageChange" />
    <dict-modal ref="dictModal" @loadData="loadData"></dict-modal>
  </div>
</template>

<script>
import DictModal from './components/DictModal';
import DictService from '@/services/system/dict';
import { formatDate } from '@/utils';
export default {
  data () {
    return {
      tableData: [],
      tableTotal: 0,
    }
  },
  filters: {
    formatDate,
  },
  methods: {
    async initDictList (params = {}) {
      const { code, message, result: { data, total } } = await DictService.dictListApi(params);
      if (Object.is(code, 0)) {
        this.tableData = data;
        this.tableTotal = total;
      } else {
        console.error('获取字典列表失败', message);
      }
    },
    // 分页
    handlePageChange (val) {
      this.initDictList({ pageNumber: val });
    },
    // 新增数据
    newDataHandle () {
      this.$refs.dictModal.openModal();
    },
    loadData () {
      this.initDictList();
    },
    // 编辑行
    editRow (rowData) {
      this.$refs.dictModal.openModal(rowData);
    },
    deleteRow (rowData) {
      this.$confirm('确认删除？', {
        type: 'warning'
      }).then(async () => {
        const { code, message } = await DictService.delDictApi(rowData.id);
        if (Object.is(code, 0)) {
          this.$message.success(message);
          this.initDictList();
        } else {
          this.$message.error(message);
        }
      })
    },
  },
  mounted () {
    this.initDictList();
  },
  components: {
    DictModal,
  }
}
</script>

<style lang="scss" scoped>
</style>