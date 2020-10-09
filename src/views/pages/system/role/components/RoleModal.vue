<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" append-to-body :before-close="resetForm">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="角色名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入角色名称">
        </el-input>
      </el-form-item>
      <el-form-item label="描素">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="资源">
        <el-tree ref="tree" :data="accessTreeData" show-checkbox node-key="id" :default-checked-keys="defaultChecked" :props="defaultProps">
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="confirmHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import RoleService from '@/services/system/role';
export default {
  data () {
    return {
      dialogVisible: false,
      title: '',
      form: {
        title: '',
        description: '',
      },
      rules: {
        title: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      isEdit: false,
      currentRowId: 0,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultChecked: [], // 默认选中的id
      accessTreeData: [],
      originAccessData: [],
    }
  },
  methods: {
    async openModal (rowData = {}) {
      await this.initRoleAccessList();
      if (Object.keys(rowData).length) {
        this.isEdit = true;
        this.title = '编辑角色';
        this.form = {
          title: rowData.title,
          description: rowData.description,
        };
        this.currentRowId = rowData.id;
        this.initCheckedAccessList(rowData.id);
      } else {
        this.title = '新增角色';
      }
      this.dialogVisible = true;
    },
    confirmHandle () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const postData = {
            ...this.form,
            accessIdsList: this.checkNodeIds(this.getCheckedKeys()),
          };
          if (this.isEdit) {
            const { code, message } = await RoleService.modifyRoleApi(this.currentRowId, postData)
            if (Object.is(code, 0)) {
              this.$message.success(message);
              this.$emit('loadData');
              this.resetForm();
            } else {
              this.$message.error(message);
            }
          } else {
            const { code, message } = await RoleService.createRoleApi(postData);
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
      this.setCheckedKeys();
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    },
    //  如果是顶层节点就要查找下面全部的节点，否则要找到最外面的父节点
    checkNodeIds (strList = []) {
      let idsList = [];
      for (const item of strList) {
        const isParentNode = this.originAccessData.find(it => (it.id == item && it.moduleId == -1));
        if (isParentNode) {
          //  查找全部的子节点
          const childrenNodeList = this.originAccessData.filter(it => it.moduleId == item).map(it => it.id);
          idsList = [...idsList, ...childrenNodeList, item];
        } else {
          //当前节点
          const currentNode = this.originAccessData.find(it => it.id == item);
          //  根据当前节点的moduleId去查找父节点id
          const parentNode = this.originAccessData.find(it => it.id == currentNode.moduleId);
          if (parentNode) {
            idsList = [...idsList, String(parentNode.id), item]
          } else {
            idsList = [...idsList, item]
          }
        }
      }
      return [...new Set(idsList.map(item => Number(item)))].toString();
    },

    // 反填值的时候判断是否全部选中,不然就要删除顶级的节点
    fullCheckNodeId (fetchCheckedList) {
      const checkedList = fetchCheckedList.map((item) => item.accessId);
      for (const item of this.originAccessData) {
        if (checkedList.includes(item.id) && item.moduleId == -1) {
          const index = checkedList.findIndex(it => it == item.id);
          checkedList.splice(index, 1);
        }
      }
      return checkedList.map(item => Number(item));
    },
    // 获取全部的角色树
    async initRoleAccessList () {
      const { code, message, result } = await RoleService.roleAccessListApi();
      if (Object.is(code, 0)) {
        this.formatAccessTress(result);
        this.originAccessData = result;
      } else {
        console.log('获取角色资源失败', message);
      }
    },
    // 格式化角色树
    formatAccessTress (dataList) {
      let resultList = [];
      //分开2次循环为了避免还没有父节点的时候就先循环了子节点
      for (const item of dataList) {
        if (item.moduleId == -1) {
          resultList.push({
            id: item.id,
            label: item.moduleName,
            children: [],
          })
        }
      }
      for (const item of dataList) {
        if (item.moduleId != -1) {
          //  根据id去查找
          const findItem = resultList.find(it => it.id == item.moduleId);
          findItem.children.push({
            id: item.id,
            label: item.actionName,
          })
        }
      }
      this.accessTreeData = resultList;
    },
    // 获取选择的key
    getCheckedKeys () {
      return this.$refs.tree.getCheckedKeys();
    },
    setCheckedKeys () {
      this.$refs.tree.setCheckedKeys([]);
    },
    // 根据角色id去获取已经授权的权限
    async initCheckedAccessList () {
      const { code, message, result } = await RoleService.roleAccessByRoleIdApi(this.currentRowId);
      if (Object.is(code, 0)) {
        // const checked = result.map(item => item.accessId);
        // this.$refs.tree.setCheckedKeys(checked);
        this.$refs.tree.setCheckedKeys(this.fullCheckNodeId(result));
      } else {
        console.error('获取已经授权的数据失败', message);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>