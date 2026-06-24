# 🏪 线上预约仓库 - 微信小程序

一个功能丰富的微信小程序，支持线上预约、下单、支付等完整的电商业务流程。

## ✨ 主要功能

### 👤 用户端
- **首页**: 商品展示、分类筛选、搜索、轮播图
- **预约系统**: 选择时间段、日期、数量进行预约
- **购物车**: 商品管理、数量调整、价格计算
- **微信支付**: 集成微信支付接口
- **订单管理**: 订单查询、取消、评价、售后
- **用户中心**: 个人信息、地址管理、收藏、优惠券、钱包

### 🛠️ 商家/管理端
- **商品管理**: 商品添加、编辑、删除、库存管理
- **预约日历**: 营业时间设置、预约时段管理
- **订单统计**: 销售数据、预约统计、收入报表
- **评价管理**: 用户评价回复、评分管理
- **活动管理**: 优惠券、折扣、营销活动

## 📁 项目结构

```
warehouse-reservation-mini-app/
├── miniprogram/              # 小程序前端代码
│   ├── pages/                # 页面
│   ├── components/           # 组件
│   ├── utils/                # 工具函数
│   ├── styles/               # 全局样式
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── server/                   # 后端代码
│   ├── routes/               # 路由
│   ├── controllers/          # 控制器
│   ├── models/               # 数据模型
│   ├── middleware/           # 中间件
│   ├── config/               # 配置文件
│   └── server.js
├── docs/                     # 文档
├── .gitignore
└── README.md
```

## 🚀 快速开始

### 前置要求
- Node.js >= 12.0
- npm 或 yarn
- 微信开发者工具

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/2507110556/warehouse-reservation-mini-app.git
cd warehouse-reservation-mini-app
```

2. **安装依赖**
```bash
npm install
```

3. **后端配置**
```bash
cd server
npm install
cp .env.example .env  # 配置环境变量
npm start
```

4. **小程序开发**
- 打开微信开发者工具
- 导入 `miniprogram` 目录
- 配置服务器地址

## 🔧 技术栈

### 前端
- **框架**: 微信小程序原生 / Taro / uni-app
- **UI组件**: WeUI / vant-weapp
- **状态管理**: Redux / Mobx / Vuex
- **HTTP请求**: wx.request / axios

### 后端
- **运行时**: Node.js
- **框架**: Express / Koa / Nest.js
- **数据库**: MySQL / MongoDB
- **支付**: 微信支付SDK
- **缓存**: Redis

### 其他
- **部署**: Docker / 云函数
- **监控**: PM2 / 日志系统
- **测试**: Jest / Mocha

## 📖 文档

详见 `docs/` 目录：
- [API文档](docs/API.md)
- [数据库设计](docs/DATABASE.md)
- [支付流程](docs/PAYMENT.md)
- [开发指南](docs/DEVELOPMENT.md)

## 💳 支付集成

支持多种支付方式：
- ✅ 微信支付（JSAPI/H5）
- ✅ 支付宝
- ✅ 银行卡支付
- 💰 余额支付

## 📊 功能模块详解

### 预约系统
- 灵活的时间段配置
- 预约人数限制
- 自动取消规则
- 预约提醒通知

### 库存管理
- 实时库存同步
- 自动扣库存
- 库存预警
- 超卖保护

### 评价系统
- 五星评价
- 图片上传
- 追评功能
- 评价权重算法

### 营销活动
- 优惠券系统
- 限时折扣
- 秒杀活动
- 推荐返利

## 🔐 安全性

- SSL/TLS加密传输
- Token认证机制
- 防止CSRF攻击
- 支付数据加密
- 用户隐私保护

## 📱 小程序功能特性

- 微信支付深度集成
- 模板消息通知
- 分享功能
- 生成小程序码
- 二维码识别
- 位置服务

## 🎯 下一步开发方向

- [ ] 拼团功能
- [ ] 积分系统
- [ ] VIP会员等级
- [ ] 社区功能
- [ ] 直播带货
- [ ] AI推荐算法
- [ ] 小程序插件支持

## 📝 许可证

MIT License

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

---

**开发者**: 2507110556  
**更新时间**: 2026年6月  
**小程序ID**: （待配置）
