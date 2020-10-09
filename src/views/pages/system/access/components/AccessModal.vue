<template>
  <div class="dialog">
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeHandle" width="400px">
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%;" @change="changeType" :disabled="isEdit">
            <el-option label="模块" value="1"></el-option>
            <el-option label="菜单" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- 如果是创建模块的时候就文本输入框,如果是菜单的时候就下拉框 -->
        <el-form-item label="模块名称" prop="moduleName" v-if="isModule">
          <el-input v-model="form.moduleName" placeholder="请输入模块名称" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleId" v-if="isMenus">
          <el-select v-model="form.moduleId" placeholder="请选择模块" style="width: 100%;" :disabled="isEdit">
            <el-option v-for="item of moduleList" :key="item.id" :label="item.moduleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="actionName" v-if="isMenus">
          <el-input v-model="form.actionName"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="小图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="1" style="width: 100%;"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AccessService from '@/services/system/access';

export default {
  name: 'create-update-dialog',
  props: {
    menusList: {
      type: Array,
      default: () => [],
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      title: '',
      isEdit: false,
      isModule: false,
      isMenus: false,
      moduleList: [],
      form: {
        moduleName: '',
        actionName: '',
        moduleId: '',
        type: '',
        icon: '',
        url: '',
        sort: 1,
      },
      currentRowId: '',
      rules: {
        moduleName: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' },
        ],
        moduleId: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' },
        ],
        actionName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请输选择类型', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入url地址', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    // 打开弹框
    openDialog (rowData = {}) {
      console.log(rowData);
      if (Object.keys(rowData).length) {
        const { moduleId, moduleName, actionName, sort, url } = rowData;
        if (moduleId == -1) {
          this.isModule = true;
          this.isMenus = false;
          this.form = Object.assign(this.form, { type: '1' });
        } else {
          this.isMenus = true;
          this.isModule = false;
          this.initModule();
          this.form = Object.assign(this.form, { type: '2' });
        }
        this.isEdit = true;
        this.form = Object.assign(this.form, { moduleId: String(moduleId), moduleName, actionName, sort, url });
        this.title = '编辑资源';
        this.currentRowId = rowData.id;
      } else {
        this.title = '新建资源';
        this.isEdit = false;
        this.currentRowId = '';
        this.form = {
          moduleName: '',
          actionName: '',
          moduleId: '',
          type: '',
          icon: '',
          url: '',
          sort: 1,
        };
      }
      this.dialogFormVisible = true;
    },
    // 提交数据
    submitForm () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const postData = this.form;
          delete postData.type;
          if (this.isEdit) {
            const { code, message } = await AccessService.modifyAccountApi(this.currentRowId, postData);
            if (Object.is(code, 0)) {
              this.$message.success(message);
              this.$emit('loadData');
              this.resetForm();
            } else {
              this.$message.error(message);
            }
          } else {
            const { code, message } = await AccessService.createAccessApi(postData);
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
    cancelForm () {
      this.resetForm();
    },
    closeHandle () {
      this.resetForm();
    },
    // 重置表单
    resetForm () {
      this.$refs.form.resetFields();
      this.dialogFormVisible = false;
    },
    // 选择类型
    async changeType (val) {
      console.log(val);
      this.isModule = false;
      this.isMenus = false;
      if (val == 1) { // 模块
        this.isModule = true;
      } else if (val == 2) { // 菜单
        await this.initModule();
        this.isMenus = true;
      } else {
        console.error('还在开发zhong')
      }
    },
    async initModule () {
      const { code, message, result } = await AccessService.moduleListApi();
      if (Object.is(code, 0)) {
        this.moduleList = result.map(item => {
          return {
            ...item,
            id: String(item.id)
          }
        });
      } else {
        console.error('获取模块失败', message);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>