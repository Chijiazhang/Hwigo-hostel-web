# 青年旅馆预订网站

一个现代化的青年旅馆预订网站，使用 Next.js 14、React 18、TypeScript 和 Tailwind CSS 构建。

## 功能特性

- 🏠 旅馆展示和搜索
- 🔍 智能搜索功能
- 📱 响应式设计
- 🎨 现代化UI设计
- 🔐 用户登录系统
- 💳 预订管理

## 新增功能

### 登录系统
- 用户可以通过点击Header中的"登录"按钮进入登录页面
- 登录页面包含邮箱和密码输入框
- 美观的渐变背景和卡片式设计
- 响应式布局，支持移动端和桌面端

## 技术栈

- **前端框架**: Next.js 14
- **UI库**: React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Lucide React
- **动画**: CSS动画

## 项目结构

```
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── login/             # 登录页面
│       └── page.tsx       # 登录组件
├── components/             # React组件
│   ├── ui/                # UI基础组件
│   │   ├── button.tsx     # 按钮组件
│   │   └── card.tsx       # 卡片组件
│   ├── Header.tsx         # 头部导航
│   ├── Hero.tsx           # 英雄区域
│   ├── SearchSection.tsx  # 搜索区域
│   ├── HostelGrid.tsx     # 旅馆网格
│   ├── HostelCard.tsx     # 旅馆卡片
│   └── Footer.tsx         # 页脚
├── types/                  # TypeScript类型定义
│   └── hostel.ts          # 旅馆类型
└── lib/                    # 工具函数
    └── utils.ts           # 通用工具
```

## 快速开始

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 登录功能
1. 在网站首页，点击右上角的"登录"按钮
2. 系统会跳转到登录页面 (`/login`)
3. 在登录页面输入邮箱和密码
4. 点击"登录"按钮提交表单

### 导航功能
- **首页**: 查看旅馆推荐和搜索功能
- **所有旅馆**: 浏览所有可用的旅馆
- **关于我们**: 了解网站信息
- **联系我们**: 获取联系方式

## 开发说明

### 添加新页面
1. 在 `app/` 目录下创建新的文件夹
2. 添加 `page.tsx` 文件
3. 在 `Header.tsx` 中添加导航链接

### 样式定制
- 使用 Tailwind CSS 类名
- 在 `globals.css` 中添加自定义样式
- 支持深色模式

### 组件开发
- 所有组件都使用 TypeScript
- 遵循 React 18 最佳实践
- 使用 shadcn/ui 组件库

## 部署

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
