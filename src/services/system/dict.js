import BaseService from './../base'

class DictService extends BaseService {
  // 添加字段
  async addDictApi (postData) {
    return await this.post('/admin/dict_config', postData);
  }

  async delDictApi (id) {
    return await this.delete(`/admin/dict_config/${id}`);
  }

  async updateDictApi (id, postData) {
    return await this.patch(`/admin/dict_config/${id}`, postData)
  }

  // 获取字典列表
  async dictListApi (params = {}) {
    return await this.get('/admin/dict_config', params);
  }

  // 根据具体的类型获取字典
  async dictByTypeApi (typeObj) {
    return await this.get('/admin/dict_config/category', typeObj);
  }
}

export default new DictService()
