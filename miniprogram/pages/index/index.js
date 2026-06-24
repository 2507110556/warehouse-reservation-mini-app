// pages/index/index.js
Page({
  data: {
    banners: [],
    recommendProducts: [],
    hotProducts: [],
    categories: [],
    loading: false,
    page: 1,
    pageSize: 10
  },

  onLoad: function () {
    this.fetchBanners();
    this.fetchRecommendProducts();
    this.fetchHotProducts();
    this.fetchCategories();
  },

  onShow: function () {
    // 页面显示时刷新购物车数量
    const app = getApp();
    this.setData({
      cartCount: app.globalData.cartCount
    });
  },

  // 获取轮播图
  fetchBanners: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/banners`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            banners: res.data.data
          });
        }
      },
      fail: err => {
        console.error('获取轮播图失败:', err);
      }
    });
  },

  // 获取推荐商品
  fetchRecommendProducts: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/recommend`,
      method: 'GET',
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            recommendProducts: res.data.data.list
          });
        }
      },
      fail: err => {
        console.error('获取推荐商品失败:', err);
      }
    });
  },

  // 获取热销商品
  fetchHotProducts: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/hot`,
      method: 'GET',
      data: {
        limit: 5
      },
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            hotProducts: res.data.data
          });
        }
      },
      fail: err => {
        console.error('获取热销商品失败:', err);
      }
    });
  },

  // 获取分类
  fetchCategories: function () {
    const app = getApp();
    wx.request({
      url: `${app.globalData.apiBaseUrl}/categories`,
      method: 'GET',
      header: {
        Authorization: `Bearer ${app.globalData.token}`
      },
      success: res => {
        if (res.data.code === 0) {
          this.setData({
            categories: res.data.data
          });
        }
      },
      fail: err => {
        console.error('获取分类失败:', err);
      }
    });
  },

  // 导航到搜索页
  navigateToSearch: function () {
    wx.navigateTo({
      url: '/pages/search/index'
    });
  },

  // 导航到详情页
  navigateToDetail: function (e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/index?id=${productId}`
    });
  },

  // 通用导航方法
  navigateTo: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  // 处理轮播图点击
  handleBannerTap: function (e) {
    const link = e.currentTarget.dataset.link;
    if (link) {
      if (link.startsWith('/')) {
        wx.navigateTo({
          url: link
        });
      } else {
        // 外部链接，使用webview
        wx.navigateTo({
          url: `/pages/webview/index?url=${encodeURIComponent(link)}`
        });
      }
    }
  },

  // 按分类筛选
  filterByCategory: function (e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/index?categoryId=${categoryId}`
    });
  },

  // 页面下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    });
    this.fetchBanners();
    this.fetchRecommendProducts();
    this.fetchHotProducts();
    this.fetchCategories();
    wx.stopPullDownRefresh();
  }
});
