<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" append-to-body :before-close="resetForm">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="Label值" prop="label">
        <el-input v-model="form.label" placeholder="请输入label">
        </el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-input v-model="form.category" placeholder="请输入分类">
        </el-input>
      </el-form-item>
      <el-form-item label="描素">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="confirmHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DictService from '@/services/system/dict';
export default {
  data () {
    return {
      dialogVisible: false,
      title: '',
      form: {
        label: '',
        category: '',
        description: '',
      },
      rules: {
        label: [
          { required: true, message: '请输入label', trigger: 'blur' },
        ],
        category: [
          { required: true, message: '请输入分类', trigger: 'blur' },
        ],
      },
      isEdit: false,
      currentRowId: 0,
    }
  },
  methods: {
    openModal (rowData = {}) {
      if (Object.keys(rowData).length) {
        this.title = '编辑字典';
        this.form = {
          label: rowData.label,
          category: rowData.category,
          description: rowData.description,
        }
        this.isEdit = true;
        this.currentRowId = rowData.id;
      } else {
        this.isEdit = false;
        this.title = '新增字典';
      }
      this.dialogVisible = true;
    },
    confirmHandle () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const postData = {
            ...this.form,
          };
          if (this.isEdit) {
            const { code, message } = await DictService.updateDictApi(this.currentRowId, postData)
            if (Object.is(code, 0)) {
              this.$message.success(message);
              this.$emit('loadData');
              this.resetForm();
            } else {
              this.$message.error(message);
            }
          } else {
            const { code, message } = await DictService.addDictApi(postData);
            if (Object.is(code, 0)) {
              this.$message.success(message);
              this.$emit('loadData');
              this.resetForm();
            } else {
              this.$message.error(message);
            }
          }
        } else {
          return false;
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    }
  },
}
</script>

<style lang="scss" scoped>
</style>