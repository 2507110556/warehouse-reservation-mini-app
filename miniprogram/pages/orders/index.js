// pages/orders/index.js
Page({
  data: {
    currentStatus: 'all',
    orders: [],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true
  },

  onLoad: function () {
    this.fetchOrders();
  },

  onShow: function () {
    // 页面显示时刷新订单列表
    this.setData({
      page: 1,
      orders: [],
      hasMore: true
    });
    this.fetchOrders();
  },

  // 获取订单列表
  fetchOrders: function () {
    if (!this.data.hasMore) return;

    this.setData({ loading: true });
    const app = getApp();
    
    const statusMap = {
      'all': '',
      'pending': 'PENDING',
      'paid': 'PAID',
      'shipped': 'SHIPPED',
      'completed': 'COMPLETED'
    };

    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders`,
      method: 'GET',
      data: {
        status: statusMap[this.data.currentStatus],
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        this.setData({ loading: false });
        if (res.data.code === 0) {
          const newOrders = res.data.data.list || [];
          
          // 添加中文状态文本
          newOrders.forEach(order => {
            const statusMap = {
              'PENDING': '待付款',
              'PAID': '已付款',
              'SHIPPED': '待取货',
              'COMPLETED': '已完成',
              'CANCELLED': '已取消',
              'REFUNDED': '已退款'
            };
            order.statusText = statusMap[order.status] || order.status;
            
            // 设置状态背景色
            const statusColorMap = {
              'PENDING': { bg: '#fff3cd', color: '#856404' },
              'PAID': { bg: '#d4edda', color: '#155724' },
              'SHIPPED': { bg: '#d1ecf1', color: '#0c5460' },
              'COMPLETED': { bg: '#d4edda', color: '#155724' },
              'CANCELLED': { bg: '#f8d7da', color: '#721c24' }
            };
            const colorInfo = statusColorMap[order.status] || { bg: '#f5f5f5', color: '#666' };
            order.statusBgColor = colorInfo.bg;
            order.statusColor = colorInfo.color;
          });

          const orders = this.data.page === 1 ? newOrders : this.data.orders.concat(newOrders);
          this.setData({
            orders: orders,
            hasMore: res.data.data.hasMore || false
          });
        }
      },
      fail: err => {
        this.setData({ loading: false });
        console.error('获取订单列表失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        });
      }
    });
  },

  // 筛选订单状态
  filterByStatus: function (e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      currentStatus: status,
      page: 1,
      orders: [],
      hasMore: true
    });
    this.fetchOrders();
  },

  // 取消订单
  cancelOrder: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: res => {
        if (res.confirm) {
          this.requestCancelOrder(orderId);
        }
      }
    });
  },

  // 请求取消订单
  requestCancelOrder: function (orderId) {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders/${orderId}/cancel`,
      method: 'POST',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          this.fetchOrders();
        } else {
          wx.showToast({
            title: res.data.message || '操作失败',
            icon: 'error'
          });
        }
      },
      fail: err => {
        console.error('取消订单失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'error'
        });
      }
    });
  },

  // 导航到订单详情
  navigateToDetail: function (e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/index?orderId=${orderId}`
    });
  },

  // 导航到首页
  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 页面下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      orders: [],
      hasMore: true
    });
    this.fetchOrders();
    wx.stopPullDownRefresh();
  },

  // 页面上拉加载更多
  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1
      });
      this.fetchOrders();
    }
  }
});
