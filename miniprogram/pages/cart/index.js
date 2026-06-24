// pages/cart/index.js
Page({
  data: {
    cart: [],
    isSelectAll: false,
    editMode: false,
    selectedCount: 0,
    totalPrice: 0
  },

  onLoad: function () {
    this.loadCart();
  },

  onShow: function () {
    // 每次显示时刷新购物车
    this.loadCart();
  },

  // 加载购物车
  loadCart: function () {
    const cart = wx.getStorageSync('cart') || [];
    cart.forEach((item, index) => {
      item.id = index;
      item.checked = item.checked || false;
    });
    this.setData({ cart: cart });
    this.calculateTotal();
  },

  // 计算总价和选中数量
  calculateTotal: function () {
    let totalPrice = 0;
    let selectedCount = 0;
    const cart = this.data.cart;

    cart.forEach(item => {
      if (item.checked) {
        totalPrice += item.price * item.quantity;
        selectedCount += item.quantity;
      }
    });

    const isSelectAll = cart.length > 0 && cart.every(item => item.checked);

    this.setData({
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      selectedCount: selectedCount,
      isSelectAll: isSelectAll
    });
  },

  // 全选
  selectAll: function (e) {
    const checked = e.detail.value[0];
    const cart = this.data.cart;
    cart.forEach(item => {
      item.checked = checked;
    });
    this.setData({ cart: cart });
    this.saveCart();
    this.calculateTotal();
  },

  // 选中单个商品
  selectItem: function (e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const checked = e.detail.value[0];
    const cart = this.data.cart;
    cart[index].checked = checked;
    this.setData({ cart: cart });
    this.saveCart();
    this.calculateTotal();
  },

  // 增加数量
  increaseQuantity: function (e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const cart = this.data.cart;
    cart[index].quantity += 1;
    this.setData({ cart: cart });
    this.saveCart();
    this.calculateTotal();
  },

  // 减少数量
  decreaseQuantity: function (e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const cart = this.data.cart;
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      this.setData({ cart: cart });
      this.saveCart();
      this.calculateTotal();
    }
  },

  // 输入数量
  inputQuantity: function (e) {
    const index = parseInt(e.currentTarget.dataset.index);
    let value = parseInt(e.detail.value) || 1;
    if (value < 1) value = 1;
    const cart = this.data.cart;
    cart[index].quantity = value;
    this.setData({ cart: cart });
    this.saveCart();
    this.calculateTotal();
  },

  // 删除商品
  deleteItem: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: res => {
        if (res.confirm) {
          const index = parseInt(e.currentTarget.dataset.index);
          const cart = this.data.cart;
          cart.splice(index, 1);
          this.setData({ cart: cart, editMode: false });
          this.saveCart();
          this.calculateTotal();
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 切换编辑模式
  toggleEditMode: function () {
    this.setData({
      editMode: !this.data.editMode
    });
  },

  // 保存购物车到本地存储
  saveCart: function () {
    wx.setStorageSync('cart', this.data.cart);
  },

  // 去结算
  goCheckout: function () {
    if (this.data.selectedCount === 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'error'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/checkout/index'
    });
  },

  // 导航到首页
  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 导航到商品详情
  navigateToDetail: function (e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/index?id=${productId}`
    });
  }
});
