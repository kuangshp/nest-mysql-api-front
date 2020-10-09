import BaseService from '../base';

class AccessService extends BaseService {
  async createAccessApi (postData) {
    return await this.post('/admin/access', postData);
  }

  async deleteAccessApi (id) {
    return await this.delete('/admin/access', id);
  }

  // 修改资源
  async modifyAccountApi (id, params) {
    return await this.patch('/admin/access', id, params);
  }
  // 获取资源列表
  async accessListApi (params) {
    return await this.get('/admin/access', params);
  }
  // 获取全部的模块
  async moduleListApi () {
    return await this.get('/admin/access/module');
  }
}

export default new AccessService();