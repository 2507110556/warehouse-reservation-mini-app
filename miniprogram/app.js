App({
  onLaunch: function () {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;

    // 检查登录状态
    this.checkLogin();

    // 初始化数据库连接（如需要）
    this.initDatabase();
  },

  onShow: function () {
    // 应用显示时的处理
    console.log('应用显示');
  },

  onHide: function () {
    // 应用隐藏时的处理
    console.log('应用隐藏');
  },

  onError: function (msg) {
    console.error('应用错误:', msg);
  },

  // 检查登录
  checkLogin: function () {
    const token = wx.getStorageSync('token');
    if (!token) {
      // 检查是否有有效的登录凭证
      wx.checkSession({
        success: () => {
          // session 未过期，并且在本生命周期一直有效
          this.login();
        },
        fail: () => {
          // session 已过期
          this.login();
        }
      });
    }
  },

  // 登录
  login: function () {
    wx.login({
      success: res => {
        if (res.code) {
          // 将code发送到后端换取token
          this.sendCodeToBackend(res.code);
        } else {
          console.error('登录失败');
        }
      },
      fail: err => {
        console.error('获取登录code失败:', err);
      }
    });
  },

  // 发送code到后端
  sendCodeToBackend: function (code) {
    const API_BASE_URL = this.globalData.apiBaseUrl;
    wx.request({
      url: `${API_BASE_URL}/auth/login`,
      method: 'POST',
      data: {
        code: code
      },
      success: res => {
        if (res.data.code === 0) {
          wx.setStorageSync('token', res.data.data.token);
          wx.setStorageSync('userInfo', JSON.stringify(res.data.data.userInfo));
          this.globalData.token = res.data.data.token;
          this.globalData.userInfo = res.data.data.userInfo;
        }
      },
      fail: err => {
        console.error('后端登录失败:', err);
      }
    });
  },

  // 初始化数据库
  initDatabase: function () {
    // 如果使用了云开发
    // wx.cloud.init({
    //   env: 'prod-xxxx'
    // });
  },

  globalData: {
    apiBaseUrl: 'https://api.example.com',
    token: null,
    userInfo: null,
    systemInfo: null,
    cartCount: 0,
    // 仓库列表（后续从服务器获取）
    warehouses: []
  }
});
