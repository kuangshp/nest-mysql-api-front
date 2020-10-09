import axios from 'axios';
import { fileObjectField, serializeObject } from '@/utils';

export default class BaseService {
  // 提供get请求方法
  async get (url, params = {}) {
    return await axios.get(`${url}?${serializeObject(params)}`);
  }

  // 提供post请求
  async post (url, postData = {}) {
    return await axios.post(url, fileObjectField(postData));
  }

  // 提供patch请求
  async patch (url, id, postData = {}) {
    return await axios.patch(`${url}/${id}`, postData);
  }

  // 提供delete请求
  async delete (url, id) {
    return await axios.delete(`${url}/${id}`);
  }
}

