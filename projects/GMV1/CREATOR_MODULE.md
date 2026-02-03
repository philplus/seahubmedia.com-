# GMV1 — 达人模块（Creators）设计（v0.1）

## 1. 已确认前提
- 平台：TikTok Shop 印尼 Seller Center
- 达人表现口径：按“成交”（非下单创建）
- 同品类定义：同一级类目或二级类目
- 建联渠道：WhatsApp

---

## 2. 模块拆分（UI 信息架构）
### A) 达人表现（Brand Creators）
**目标**：复盘/优化“已合作/已带货达人”的成交贡献与质量。

页面：
1) 达人总览
2) 达人详情
3) 达人-商品贡献

### B) 达人库 & 建联（Creator Prospecting）
**目标**：在联盟市场/同品类下发现高潜达人 → 建联 → 跟进 → 转化。

页面：
1) 达人库（同类目榜单）
2) 达人详情（画像 + 近期表现）
3) 建联看板（CRM 状态流）

---

## 3. 达人表现（Brand Creators）— 数据字段（Required Data Tags）
> 以“成交”作为主口径，尽量按日聚合 + 支持按达人/店铺/类目筛选。

### 维度（Dimensions）
- entity_id / entity_name
- store_id / store_name / platform_shop_id
- day（WIB）
- creator_id / creator_handle / creator_name
- category_lv1_id / category_lv1_name
- category_lv2_id / category_lv2_name
- content_type（video/live/other，可选）

### 指标（Metrics）
- gmv_net_deal（成交净GMV：扣退货，平台口径）
- orders_deal（成交订单数）
- aov_deal（成交客单）
- returns_amount / returns_rate（如平台提供达人归因的退货/退款）
- commission_amount / commission_rate（如可取）
- cost_total（坑位费/样品成本等，若你有内部记录）
- roi（可计算：gmv_net_deal / cost_total）

### 贡献结构
- top_products（Top10 商品：product_id/name, gmv_deal, orders_deal）
- share_of_store_gmv（达人贡献占店铺GMV比例，可计算）

---

## 4. 达人库&建联（Prospecting）— 数据字段（Required Data Tags）
数据源优先级：API（联盟市场）> 半自动导出 > 爬虫兜底

### 维度
- category_lv1/lv2（用于“同品类”）
- creator_id / handle / name
- region（如可取）
- follower_range（如可取）
- content_tags（可选：风格/垂类关键词）

### 表现指标（以联盟市场可获得为准）
- gmv_est / orders_est（如有）
- avg_views / engagement（如有）
- recent_30d_trend（如有）

### 建联字段（CRM）
- outreach_status：uncontacted / messaged / replied / negotiating / sample_sent /合作中 /复购
- whatsapp_number（若可合法获取/你人工补充）
- last_contacted_at
- next_followup_at
- notes
- owner（负责BD/运营）

---

## 5. 拉取频率（Data Pull Frequency）
- Brand Creators（自家达人表现）：每日 1 次（跟随日报），支持按日回拉 90 天
- Prospecting（达人库）：每日或每周 2-3 次即可（低频，避免频繁抓取）；榜单/类目维度缓存

---

## 6. 页面组件（UI 规格简表）
### 达人总览
- Filters：日期范围（默认昨日/近7天）、店铺、类目（lv1/lv2）、达人状态（合作中/曾合作）
- KPI Cards：成交净GMV、成交订单、客单、退货率、ROI（如有成本）
- Table：达人列表（可排序：GMV、ROI、退货率、DoD）
- Quick actions：查看详情、加入建联库（如果是新达人）

### 达人详情
- 趋势图：近30天成交净GMV/订单
- Top10 商品贡献
- 异常：GMV 断崖/退货率飙升

### 达人库（同类目榜单）
- Filters：类目 lv1/lv2、GMV区间、粉丝区间（如有）
- Table：达人候选（表现指标 + 标签）
- CTA：标记为“要联系”→ 生成 WhatsApp 建联任务

### 建联看板（CRM）
- Kanban：按 outreach_status 分列
- 每卡：达人、类目、预估表现、最后联系时间、下一次跟进
- Actions：设置下一次跟进提醒（对接 reminders 项目/cron）
