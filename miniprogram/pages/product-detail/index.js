// pages/product-detail/index.js
Page({
  data: {
    productId: '',
    product: {
      id: 0,
      name: '',
      price: 0,
      oldPrice: 0,
      description: '',
      images: [],
      stock: 0,
      sales: 0,
      rating: 0,
      reviewCount: 0,
      avgRating: 0,
      isAppointmentRequired: true,
      specs: [],
      detailHtml: ''
    },
    quantity: 1,
    selectedSpecs: {},
    appointmentDate: '',
    today: '',
    availableTimeSlots: [],
    selectedTimeSlot: null,
    isFavorite: false,
    reviews: [],
    ratingLevel: ''
  },

  onLoad: function (options) {
    this.setData({
      productId: options.id
    });
    this.initDate();
    this.fetchProductDetail();
    this.fetchReviews();
  },

  // 初始化日期
  initDate: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${date}`;
    
    this.setData({
      today: todayStr,
      appointmentDate: todayStr
    });
    
    this.fetchTimeSlots(todayStr);
  },

  // 获取产品详情
  fetchProductDetail: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/${this.data.productId}`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            product: res.data.data
          });
          this.checkFavorite();
          this.updateRatingLevel();
        }
      },
      fail: err => {
        console.error('获取产品详情失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        });
      }
    });
  },

  // 获取评价列表
  fetchReviews: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/${this.data.productId}/reviews`,
      method: 'GET',
      data: {
        page: 1,
        pageSize: 3
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            reviews: res.data.data.list
          });
        }
      },
      fail: err => {
        console.error('获取评价失败:', err);
      }
    });
  },

  // 获取可用时间段
  fetchTimeSlots: function (date) {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/appointments/time-slots`,
      method: 'GET',
      data: {
        date: date,
        warehouseId: this.data.product.warehouseId
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            availableTimeSlots: res.data.data
          });
        }
      },
      fail: err => {
        console.error('获取时间段失败:', err);
      }
    });
  },

  // 检查收藏状态
  checkFavorite: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/favorites/${this.data.productId}`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            isFavorite: res.data.data.isFavorite
          });
        }
      }
    });
  },

  // 更新评分等级
  updateRatingLevel: function () {
    const avgRating = this.data.product.avgRating;
    let level = '差';
    if (avgRating >= 4.5) {
      level = '非常好';
    } else if (avgRating >= 4) {
      level = '好';
    } else if (avgRating >= 3) {
      level = '一般';
    }
    this.setData({ ratingLevel: level });
  },

  // 增加数量
  increaseQuantity: function () {
    if (this.data.quantity < this.data.product.stock) {
      this.setData({
        quantity: this.data.quantity + 1
      });
    }
  },

  // 减少数量
  decreaseQuantity: function () {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },

  // 输入数量
  inputQuantity: function (e) {
    let value = parseInt(e.detail.value) || 1;
    if (value < 1) value = 1;
    if (value > this.data.product.stock) value = this.data.product.stock;
    this.setData({
      quantity: value
    });
  },

  // 选择规格
  selectSpec: function (e) {
    const specName = e.currentTarget.dataset.specName;
    const specValue = e.currentTarget.dataset.specValue;
    const selectedSpecs = this.data.selectedSpecs;
    selectedSpecs[specName] = specValue;
    this.setData({
      selectedSpecs: selectedSpecs
    });
  },

  // 选择日期
  selectDate: function (e) {
    this.setData({
      appointmentDate: e.detail.value
    });
    this.fetchTimeSlots(e.detail.value);
  },

  // 选择时间段
  selectTimeSlot: function (e) {
    const slotId = e.currentTarget.dataset.slotId;
    this.setData({
      selectedTimeSlot: slotId
    });
  },

  // 切换收藏
  toggleFavorite: function () {
    const app = getApp();
    const method = this.data.isFavorite ? 'DELETE' : 'POST';
    wx.request({
      url: `${app.globalData.apiBaseUrl}/favorites/${this.data.productId}`,
      method: method,
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            isFavorite: !this.data.isFavorite
          });
          wx.showToast({
            title: this.data.isFavorite ? '已收藏' : '已取消收藏',
            icon: 'success'
          });
        }
      },
      fail: err => {
        console.error('操作失败:', err);
        wx.showToast({
          title: '操作失败',
          icon: 'error'
        });
      }
    });
  },

  // 加入购物车
  addToCart: function () {
    const cartItem = {
      productId: this.data.productId,
      productName: this.data.product.name,
      price: this.data.product.price,
      quantity: this.data.quantity,
      specs: this.data.selectedSpecs,
      image: this.data.product.images[0]
    };

    let cart = wx.getStorageSync('cart') || [];
    const existIndex = cart.findIndex(item => 
      item.productId === cartItem.productId && 
      JSON.stringify(item.specs) === JSON.stringify(cartItem.specs)
    );

    if (existIndex !== -1) {
      cart[existIndex].quantity += cartItem.quantity;
    } else {
      cart.push(cartItem);
    }

    wx.setStorageSync('cart', cart);
    const app = getApp();
    app.globalData.cartCount = cart.length;

    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  // 立即预约
  buyNow: function () {
    if (this.data.product.isAppointmentRequired && !this.data.selectedTimeSlot) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'error'
      });
      return;
    }

    this.addToCart();

    wx.navigateTo({
      url: '/pages/checkout/index'
    });
  },

  // 联系客服
  contactService: function () {
    wx.makePhoneCall({
      phoneNumber: '400-800-1234'
    });
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: this.data.product.name,
      desc: this.data.product.description,
      path: `/pages/product-detail/index?id=${this.data.productId}`,
      imageUrl: this.data.product.images[0]
    };
  },

  // 导航到评价页面
  navigateToReviews: function () {
    wx.navigateTo({
      url: `/pages/evaluation/index?productId=${this.data.productId}`
    });
  }
});
