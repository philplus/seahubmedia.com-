# Seahub Media — 项目架构记录
_最后更新：2026-04-01_

---

## 当前独立项目

### 项目一：seahubmedia.com（公司官网）
- **本地路径**：`~/Documents/GitHub/seahubmedia.com-`
- **线上地址**：seahubmedia.com
- **技术栈**：纯 HTML + CSS + JavaScript（无前端框架）
- **状态**：线上运行中
- **当前导航**：Home / TSP / MCN / Careers / About Us
- **子目录**：`tsp/`、`mcn/`、`careers/`、`assets/`、`scripts/`

---

### 项目二：数据中心（内部数据平台）
- **本地路径**：`~/Desktop/数据中心`
- **技术栈**：
  - 后端：Python + FastAPI + SQLite（SQLAlchemy）+ APScheduler
  - 前端：React + Vite + TailwindCSS + Recharts
  - 容器：Docker + docker-compose
- **状态**：开发中（MVP 阶段，代码任务于 2026-04-01 进行中）
- **核心功能**：
  - TikTok 达人数据：粉丝数、视频表现、互动率、GMV、联系方式
  - Shopee 店铺数据：销量、SKU、价格波动、平台补贴、评论情感分析
  - 可视化 Dashboard + 达人列表 + 店铺列表 + 详情页 + 价格趋势图
  - 爬虫模块（MVP 阶段用 mock 数据，后续填充真实抓取逻辑）

---

## 整合规划（待执行）

### 目标
将「数据中心」集成进 seahubmedia.com，通过网站入口访问，无需局域网。

### 方案
1. 在 seahubmedia.com 导航栏 / banner 区域增加「数据中心」入口
2. 点击后进入登录页（二级页面），通过身份验证后可访问数据
3. 数据中心前端（React）打包后托管在同一域名或子路径下
4. 数据中心后端（FastAPI）部署在服务器，官网通过 API 请求获取数据

### 待确认事项
- [x] 部署方式 → **静态托管**（官网 + 数据中心前端打包为静态文件，继续托管在现有平台）
- [x] 入口方式 → **二级页面，路径 `seahubmedia.com/data/`**
- [x] 服务器 → **暂无，待数据中心开发完成后购买 VPS 部署 FastAPI 后端**（推荐阿里云轻量 / Render）
- [x] 登录账号体系 → **多用户，注册需管理员审批，角色权限分级**

---

## 无关项目（不纳入整合范围）
- **GMV1-Web**：内部 GMV 仪表板，独立运行，与本次整合无关
