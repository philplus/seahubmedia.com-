# GMV1 — 电商数据分析系统开发

## 目标
多主体多店铺的电商+广告数据每日自动拉取、入库、分析，并在 09:00 WIB 发送 WhatsApp 日报。

## 已确认口径
- 发送时间：09:00 WIB 每日
- 订单口径：下单创建（order created）
- GMV：净销售额（扣除退货），平台口径
- 多店铺：每店 Top10 商品
- 历史回拉：3 个月
- 运行环境：Mac mini

## 交付物（已在项目中产出）
- ARCHITECTURE.md（系统架构 v0.1）
- SCHEMA.sql（SQLite 表结构 v0.1）
- PIPELINE.md（任务流水线 v0.1）
- REPORT_TEMPLATE.md（WhatsApp 日报模板 v0.1）

## 待补充信息
- 店铺/主体清单（多少主体、每主体几店、店铺名称/标识）
- 优先接入顺序：TikTok Shop 经营数据 vs 广告数据
- 日报接收人（WhatsApp 号码列表）
- 异常阈值（GMV/订单/退货率等）默认值是否接受
