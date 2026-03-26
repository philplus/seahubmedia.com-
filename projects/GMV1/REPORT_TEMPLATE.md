# GMV1 — WhatsApp 日报模板（v0.1）

> 原则：短、可行动、先结论后细节。

**GMV日报｜{{date}}（WIB）**

**总览**
- GMV净额：{{gmv_total}}（DoD {{gmv_dod}}）
- 下单数：{{orders_total}}（DoD {{orders_dod}}）
- 客单价：{{aov_total}}（DoD {{aov_dod}}）
- 退货/退款：{{returns_total}}（{{returns_rate_total}}）

**店铺明细（每店 Top10）**
{{#stores}}
**{{store_name}}**
- GMV净额：{{gmv}}（DoD {{gmv_dod}}）｜下单：{{orders}}｜客单：{{aov}}｜退货：{{returns}}（{{returns_rate}}）
- Top10 商品：
{{#top10}}
  {{rank}}) {{product_name}}｜GMV {{gmv}}｜单量 {{units}}
{{/top10}}
- 异常：{{anomalies}}
- 今日动作：{{actions}}
{{/stores}}

**备注**
- 口径：下单创建；GMV=净销售额（扣退货，平台口径）
