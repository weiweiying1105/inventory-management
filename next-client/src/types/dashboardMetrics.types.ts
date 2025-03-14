/** 仪表盘指标数据的主要接口，包含销售、采购、支出等汇总数据 */
export interface DashboardMetrics {
  salesSummary: SalesSummary[];      // 销售汇总数据数组
  purchaseSummary: PurchaseSummary[];// 采购汇总数据数组
  expenseSummary: ExpenseSummary[];  // 支出汇总数据数组
  recentSales: Sales[];              // 最近销售记录数组
  popularProducts: Products[];        // 热门产品数组
  expenseByCategorySummary: ExpenseByCategorySummary[]; // 按类别划分的支出汇总数据数组
}
export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}
/** 产品信息接口 */
export interface Products {
  productId: string;         // 产品唯一标识符
  name: string;              // 产品名称
  price: number;             // 产品价格
  rating?: number;           // 产品评分（可选）
  stockQuantity: number;     // 库存数量
  sales?: Sales[];          // 产品相关的销售记录（可选）
  image: string;
  purchases?: Purchases[];   // 产品相关的采购记录（可选）
}

/** 销售记录接口 */
export interface Sales {
  saleId: string;           // 销售记录唯一标识符
  productId: string;        // 相关产品ID
  timestamp: Date;          // 销售时间戳
  quantity: number;         // 销售数量
  unitPrice: number;        // 单价
  totalAmount: number;      // 总金额
  product?: Products;       // 相关产品信息（可选）
}

/** 采购记录接口 */
export interface Purchases {
  purchaseId: string;       // 采购记录唯一标识符
  productId: string;        // 相关产品ID
  timestamp: Date;          // 采购时间戳
  quantity: number;         // 采购数量
  unitCost: number;         // 单位成本
  totalCost: number;        // 总成本
  product?: Products;       // 相关产品信息（可选）
}

/** 支出记录接口 */
export interface Expenses {
  expenseId: string;        // 支出记录唯一标识符
  category: string;         // 支出类别
  amount: number;           // 支出金额
  timestamp: Date;          // 支出时间戳
}

/** 销售汇总接口 */
export interface SalesSummary {
  salesSummaryId: string;   // 销售汇总唯一标识符
  totalValue: number;       // 总销售额
  changePercentage?: number;// 变化百分比（可选）
  date: Date;              // 汇总日期
}

/** 采购汇总接口 */
export interface PurchaseSummary {
  purchaseSummaryId: string;// 采购汇总唯一标识符
  totalPurchased: number;   // 总采购额
  changePercentage?: number;// 变化百分比（可选）
  date: Date;              // 汇总日期
}

/** 支出汇总接口 */
export interface ExpenseSummary {
  expenseSummaryId: string; // 支出汇总唯一标识符
  totalExpenses: number;    // 总支出
  date: Date;              // 汇总日期
  expensesByCategory: ExpenseByCategory[]; // 按类别划分的支出数组
}

/** 按类别统计的支出接口 */
export interface ExpenseByCategory {
  expenseByCategoryId: string; // 类别支出唯一标识符
  expenseSummaryId: string;    // 关联的支出汇总ID
  category: string;            // 支出类别
  amount: number;             // 该类别的支出金额
  date: Date;                 // 记录日期
}

