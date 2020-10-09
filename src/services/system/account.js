import BaseService from '../base';

class AccountService extends BaseService {
  async createAccountApi (postData) {
    return await this.post('/admin/account', postData);
  }

  async deleteAccountApi (id) {
    return await this.delete('/admin/account', id);
  }

  async modifyAccountApi (id, params) {
    return await this.patch('/admin/account', id, params);
  }

  async accountListApi (params) {
    return await this.get('/admin/account', params);
  }

  // 根据账号id获取已经授权的角色
  async accountRoleListApi (id) {
    return await this.get(`/admin/account_role/${id}`);
  }
}

export default new AccountService()