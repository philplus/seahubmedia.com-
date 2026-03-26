# GMV1 — 达人模块 UI 字段清单（v0.1）

口径策略：默认展示 `creator_gmv_gross`（原始GMV）；如后续 API 可取 `creator_gmv_net`（净额）则切换展示为净额，并保留原始列用于对照（可隐藏）。

## A. 达人表现（Brand Creators）
### A1) 达人总览（列表页）
**筛选区（Filters）**
- 日期范围：昨日 / 近7天 / 近30天 / 自定义
- 主体/店铺：多选
- 类目：一级/二级（级联）
- 达人：搜索（handle/name）

**KPI 卡片（KPI Cards）**
- 达人销售GMV：Σ creator_gmv_gross（后续可切 net）
- 达人成交订单：Σ creator_orders（如有）
- 达人客单价：Σ GMV / Σ orders（或 platform aov）
- 退货/退款：returns_amount & returns_rate（如有）

**达人列表（Table）**
- 达人：avatar + name + handle
- 归属类目：lv1 / lv2
- GMV（默认原始）：creator_gmv_gross（DoD、WoW）
- 订单：creator_orders（DoD）
- 客单：creator_aov
- 退货率：returns_rate
- 佣金：commission_amount / commission_rate（可选列）
- Top3 商品：product_name x3（快速预览）
- 操作：查看详情 / 加入建联 / 导出

### A2) 达人详情页
- Header：达人信息（name/handle/WhatsApp）+ 类目标签 + 当前状态
- 趋势图：30天 GMV（gross/net）+ 订单（双轴）
- Top10 商品贡献：product, units, GMV, rank
- 异常卡片：
  - GMV 断崖（DoD/WoW）
  - 退货率异常（如有）
- 合作记录（可选）：费用/佣金/备注（手工录入）

---

## B. 达人库&建联（Creator Prospecting）
### B1) 达人库（榜单/搜索）
**筛选区**
- 类目：一级/二级（必选）
- 近30天表现：区间筛选（如数据源提供）
- 粉丝区间/地区/内容类型（如数据源提供）

**候选表（Table）**
- 达人：name/handle
- 类目匹配：lv1/lv2
- 表现指标：GMV_est / orders_est / views（按数据源可用字段）
- 标签：内容风格/垂类关键词
- 操作：加入建联（创建 creator + outreach 记录）

### B2) 建联看板（CRM）
**列（Status）**
- uncontacted / messaged / replied / negotiating / sample_sent / active / retained

**卡片字段**
- 达人：name/handle
- WhatsApp：whatsapp_number
- 类目：lv1/lv2
- 关键表现：GMV（可用字段）
- 最近联系：last_contacted_at
- 下次跟进：next_followup_at（可与 reminders 联动）
- 备注：notes

**动作**
- 生成 WhatsApp 发送内容（模板）
- 标记已联系/已回复
- 设置下次跟进提醒

## 数据口径标记（UI 必须显示）
- 当展示为 gross：标注“GMV（原始，Seller Center）”
- 当展示为 net：标注“GMV（净额，扣退货）”
- 若两者同时存在：默认展示 net，并提供列开关显示 gross
