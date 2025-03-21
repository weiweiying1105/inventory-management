

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardMetrics } from "@/types/dashboardMetrics.types";
import { Category, NewProduct, Product } from "@/types/product";
import { User } from "@/types/user";

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}
// 创建一个api服务，该实例可以用于与后端api进行交互
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  reducerPath: "api", // 定义reducer的路径，用于在store中存储数据.这是Redux Store中唯一的标识符
  tagTypes: ["DashboardMetrics", "Expenses", "Products", "Users", "Expense", "Categories"], // 定义标签类型，用于缓存和更新数据
  endpoints: (build) => ({

    // 获取仪表板指标
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"], // 定义标签，用于缓存和更新数据
    }),
    // 按照分类
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
    // 获取产品
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    // 创建产品
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // 获取用户
    getUsers: build.query<User[], string | void>({
      query: () => '/users',
      providesTags: ["Users"],
    }),

    // 获取产品分类
    getCategories: build.query<{ list: Category[] }, string | null>({
      query: () => '/category',
      providesTags: ["Categories"],
    }),

    // 新产品分类
    createCategory: build.mutation<Category, Category>({
      query: (newCategory) => ({
        url: '/category',
        method: 'POST',
        body: newCategory
      }),
      invalidatesTags: ["Categories"]
    })

    // 

  }),
})
// build.query的泛型，第一个为返回类型，第二个为查询参数类型
export const { useGetDashboardMetricsQuery, useGetExpensesByCategoryQuery, useGetProductsQuery, useCreateProductMutation, useGetUsersQuery, useGetCategoriesQuery, useCreateCategoryMutation } = api;


/**
 * build.query
 * RTK Query 是 Redux Toolkit 提供的用于处理异步数据获取的库。它提供了一种简单的方式来定义和调用 API 请求，并自动处理数据的缓存、更新和错误处理。
 * 当使用 RTK Query的自动生成hook时，他返回一根包含多属性的对象：
 *  - data: 请求返回的数据
 *  - isError: 是否发生了错误
 *  - isLoading: 是否正在加载数据
 *  - isSuccess: 请求是否成功
 *  - error: 如果请求失败，则包含错误信息
 *  - isFetching: 是否正在请求数据
 */

/**
 * 在多个页面使用useGetDashboardMetricsQuery，但是实际上接口只调用了一次
 * - RTK Query 会自动缓存数据，并在后续的请求中返回缓存的数据，而不是再次调用接口
 * - 如果数据发生了变化，RTK Query 会自动更新缓存的数据，并在后续的请求中返回最新的数据
 * 
 * 
 * - 机制：
 *  - 当第一个组件挂载并调用 useGetDashboardMetricsQuery 时，RTK Query 会自动调用接口并返回数据
 *  - 当第二个组件挂载并调用 useGetDashboardMetricsQuery 时，RTK Query 会检查缓存中是否存在数据，如果存在则直接返回缓存的数据，而不是再次调用接口
 *  - 如果数据发生了变化，RTK Query 会自动更新缓存的数据，并在后续的请求中返回最新的数据
 * 
 */