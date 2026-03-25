# GMV1 — 每日任务流水线（v0.1）

## Job 1: 回拉（Backfill 3 months）
1. 输入：店铺清单 + 各店 OAuth token
2. 拉取：
   - 订单（按创建时间范围分页）
   - 退货/退款（按创建时间范围分页）
   - 商品销量（如 API 支持按日聚合；否则由订单明细聚合）
3. 入库：raw_orders / raw_returns / raw_product_sales
4. 计算：orders_daily / returns_daily / products_daily(rank)
5. 校验：
   - 每天是否都有数据（空日允许但需标记）
   - 币种一致性
   - 净额是否扣退货（若平台给的是净额字段，优先用；否则计算）

## Job 2: 每日（Daily 09:00 WIB）
**08:30** 拉取 T-1（昨日）数据（WIB日界）
- orders (created)
- returns/refunds
- product sales
- ads (if connected)

**08:40** 入库 + 聚合

**08:50** 异常检测
- GMV DoD 跌幅 > 阈值
- 订单 DoD 跌幅 > 阈值
- 退货率上升 > 阈值
- Top SKU 断崖（rank 变化、GMV下降）

**09:00** 生成 WhatsApp 文本并发送

## Observability
- runs 表：记录每次运行耗时、错误、拉取条数
- 失败重试：按数据源重试，不重复写入（幂等 upsert）
