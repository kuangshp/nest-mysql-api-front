<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" append-to-body :before-close="resetForm">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="账号名" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号名" :disabled="isEdit">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!isEdit">
        <el-input v-model="form.password" type="password" placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-checkbox-group v-model="checkedRoleList">
          <el-checkbox v-for="item of roleList" :key="item.id" :label="item.id">{{item.title}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AccountService from '@/services/system/account';
import RoleService from '@/services/system/role';
export default {
  data () {
    return {
      dialogVisible: false,
      title: '',
      form: {
        username: '',
        password: '',
      },
      roleList: [],
      checkedRoleList: [],
      rules: {
        username: [
          { required: true, message: '请输入账号名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      isEdit: false,
      currentRowId: 0,
    }
  },
  methods: {
    openModal (rowData = {}) {
      if (Object.keys(rowData).length) {
        this.title = '编辑账号';
        this.form = {
          username: rowData.username,
        }
        this.isEdit = true;
        this.currentRowId = rowData.id;
        this.initAccountRoleList(rowData.id);
      } else {
        this.title = '新增账号';
        this.checkedRoleList = [];
      }
      this.dialogVisible = true;
    },
    // 获取全部的角色
    async initRoleList () {
      const { code, message, result: { data } } = await RoleService.roleListApi({ pageSize: 100 });
      if (Object.is(code, 0)) {
        this.roleList = data;
      } else {
        console.error('获取角色列表失败', message);
      }
    },
    async initAccountRoleList (accountId) {
      const { code, message, result } = await AccountService.accountRoleListApi(accountId);
      if (Object.is(code, 0)) {
        console.log(result);
        this.checkedRoleList = result.map(item => item.roleId);
      } else {
        console.log('获取授权角色失败', message);
      }
    },
    confirmHandle () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const postData = {
            ...this.form,
            roles: this.checkedRoleList.toString(),
          };
          if (this.isEdit) {
            const { code, message } = await AccountService.modifyAccountApi(this.currentRowId, postData)
            if (Object.is(code, 0)) {
              this.$message.success(message);
              this.$emit('loadData');
              this.resetForm();
            } else {
              this.$message.error(message);
            }
          } else {
            const { code, message } = await AccountService.createAccountApi(postData);
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
  mounted () {
    this.initRoleList();
  }
}
</script>

<style lang="scss" scoped>
</style>