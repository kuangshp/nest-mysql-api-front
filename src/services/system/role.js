import BaseService from '../base';

class RoleService extends BaseService {
  async createRoleApi (postData) {
    return await this.post('/admin/role', postData);
  }

  async deleteRoleApi (id) {
    return await this.delete('/admin/role', id);
  }

  async modifyRoleApi (id, params) {
    return await this.patch('/admin/role', id, params);
  }

  async roleListApi (params) {
    return await this.get('/admin/role', params);
  }

  // 获取全部的角色资源
  async roleAccessListApi () {
    return await this.get('/admin/role_access');
  }

  // 根据角色id获取资源
  async roleAccessByRoleIdApi (roleId) {
    return await this.get(`/admin/role_access/${roleId}`);
  }
}

export default new RoleService();