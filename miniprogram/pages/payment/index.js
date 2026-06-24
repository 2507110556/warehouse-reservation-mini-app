// pages/payment/index.js
Page({
  data: {
    orderId: '',
    amount: 0,
    paymentMethod: 'wechat',
    accountBalance: 0,
    paying: false
  },

  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      amount: parseFloat(options.amount)
    });
    this.getAccountBalance();
  },

  // 获取账户余额
  getAccountBalance: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/wallet/balance`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            accountBalance: res.data.data.balance
          });
        }
      },
      fail: err => {
        console.error('获取余额失败:', err);
      }
    });
  },

  // 选择支付方式
  selectPaymentMethod: function (e) {
    const method = e.currentTarget.dataset.method;
    this.setData({
      paymentMethod: method
    });
  },

  // 开始支付
  startPayment: function () {
    const paymentMethod = this.data.paymentMethod;

    switch (paymentMethod) {
      case 'wechat':
        this.wechatPay();
        break;
      case 'alipay':
        this.alipay();
        break;
      case 'balance':
        this.balancePay();
        break;
      default:
        wx.showToast({
          title: '请选择支付方式',
          icon: 'error'
        });
    }
  },

  // 微信支付
  wechatPay: function () {
    this.setData({ paying: true });
    const app = getApp();

    // 先调用后端API获取支付参数
    wx.request({
      url: `${app.globalData.apiBaseUrl}/payments/wechat-pay`,
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        amount: this.data.amount
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          const payData = res.data.data;
          // 发起微信支付
          wx.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package,
            signType: payData.signType,
            paySign: payData.paySign,
            success: (res) => {
              this.setData({ paying: false });
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
              setTimeout(() => {
                wx.navigateTo({
                  url: `/pages/order-detail/index?orderId=${this.data.orderId}`
                });
              }, 1500);
            },
            fail: (err) => {
              this.setData({ paying: false });
              console.error('支付失败:', err);
              wx.showToast({
                title: '支付失败，请重试',
                icon: 'error'
              });
            }
          });
        } else {
          this.setData({ paying: false });
          wx.showToast({
            title: res.data.message || '获取支付信息失败',
            icon: 'error'
          });
        }
      },
      fail: err => {
        this.setData({ paying: false });
        console.error('请求支付失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'error'
        });
      }
    });
  },

  // 支付宝支付
  alipay: function () {
    wx.showToast({
      title: '暂不支持支付宝支付',
      icon: 'error'
    });
  },

  // 余额支付
  balancePay: function () {
    if (this.data.accountBalance < this.data.amount) {
      wx.showToast({
        title: '账户余额不足',
        icon: 'error'
      });
      return;
    }

    this.setData({ paying: true });
    const app = getApp();

    wx.request({
      url: `${app.globalData.apiBaseUrl}/payments/balance-pay`,
      method: 'POST',
      data: {
        orderId: this.data.orderId,
        amount: this.data.amount
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        this.setData({ paying: false });
        if (res.data.code === 0) {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/order-detail/index?orderId=${this.data.orderId}`
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '支付失败',
            icon: 'error'
          });
        }
      },
      fail: err => {
        this.setData({ paying: false });
        console.error('余额支付失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'error'
        });
      }
    });
  }
});
