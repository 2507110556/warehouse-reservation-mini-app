// pages/checkout/index.js
Page({
  data: {
    selectedItems: [],
    selectedAddress: null,
    selectedCoupon: null,
    remark: '',
    subtotal: 0,
    shippingFee: 10,
    discount: 0,
    totalPrice: 0,
    submitting: false
  },

  onLoad: function () {
    this.loadCartItems();
    this.loadDefaultAddress();
    this.calculatePrice();
  },

  // 加载购物车中被选中的商品
  loadCartItems: function () {
    const cart = wx.getStorageSync('cart') || [];
    const selectedItems = cart.filter(item => item.checked);
    this.setData({ selectedItems: selectedItems });
  },

  // 加载默认地址
  loadDefaultAddress: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/addresses/default`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0 && res.data.data) {
          this.setData({ selectedAddress: res.data.data });
        }
      },
      fail: err => {
        console.error('获取地址失败:', err);
      }
    });
  },

  // 计算价格
  calculatePrice: function () {
    const selectedItems = this.data.selectedItems;
    let subtotal = 0;
    selectedItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    const shippingFee = this.data.shippingFee;
    const discount = this.data.selectedCoupon ? this.data.selectedCoupon.discount : 0;
    const totalPrice = subtotal + shippingFee - discount;

    this.setData({
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: discount,
      totalPrice: parseFloat(totalPrice.toFixed(2))
    });
  },

  // 选择地址
  selectAddress: function () {
    wx.navigateTo({
      url: '/pages/address-list/index?from=checkout'
    });
  },

  // 选择优惠券
  selectCoupon: function () {
    wx.navigateTo({
      url: '/pages/coupons/index?from=checkout'
    });
  },

  // 输入备注
  inputRemark: function (e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 提交订单
  submitOrder: function () {
    if (!this.data.selectedAddress) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'error'
      });
      return;
    }

    if (this.data.selectedItems.length === 0) {
      wx.showToast({
        title: '订单为空',
        icon: 'error'
      });
      return;
    }

    this.setData({ submitting: true });

    const app = getApp();
    const orderData = {
      items: this.data.selectedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        specs: item.specs,
        appointmentDate: item.appointmentDate,
        appointmentTime: item.appointmentTime
      })),
      addressId: this.data.selectedAddress.id,
      couponId: this.data.selectedCoupon ? this.data.selectedCoupon.id : null,
      remark: this.data.remark,
      totalPrice: this.data.totalPrice
    };

    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders`,
      method: 'POST',
      data: orderData,
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        this.setData({ submitting: false });
        if (res.data.code === 0) {
          const orderId = res.data.data.orderId;
          wx.showToast({
            title: '订单创建成功',
            icon: 'success'
          });
          // 清空购物车
          wx.setStorageSync('cart', []);
          // 导航到支付页面
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/payment/index?orderId=${orderId}&amount=${this.data.totalPrice}`
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '订单创建失败',
            icon: 'error'
          });
        }
      },
      fail: err => {
        this.setData({ submitting: false });
        console.error('创建订单失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'error'
        });
      }
    });
  },

  // 页面返回时检查是否选择了地址或优惠券
  onShow: function () {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (prevPage && prevPage.route.indexOf('address-list') !== -1) {
      // 从地址列表返回
      const selectedAddress = prevPage.data.selectedAddress;
      if (selectedAddress) {
        this.setData({ selectedAddress: selectedAddress });
      }
    }

    if (prevPage && prevPage.route.indexOf('coupons') !== -1) {
      // 从优惠券列表返回
      const selectedCoupon = prevPage.data.selectedCoupon;
      if (selectedCoupon) {
        this.setData({ selectedCoupon: selectedCoupon });
        this.calculatePrice();
      }
    }
  }
});
