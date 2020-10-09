import MenuService from '@/services/menu';

export default {
  state: {
    authMenuList: [], // 授权的菜单列表(服务器端的)
  },
  mutations: {
    setAuthMenuList (state, payload) {
      state.authMenuList = payload;
    }
  },
  actions: {
    // 获取菜单的api
    async getMenuListApi ({ commit }) {
      const { code, message, result } = await MenuService.getMenuList();
      if (Object.is(code, 0)) {
        commit('setAuthMenuList', result);
        return result;
      } else {
        console.error('获取菜单失败', message);
      }
    },
  }
}