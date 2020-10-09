import BaseService from './base';

class LoginService extends BaseService {
  // 登录接口
  async loginApi (postData) {
    return this.post('/admin/login', postData);
  }
}

export default new LoginService();