import BaseService from './base';

class MenuService extends BaseService {
  // 获取菜单的接口
  async getMenuList () {
    return await this.get('/admin/menus');
  }
}

export default new MenuService();