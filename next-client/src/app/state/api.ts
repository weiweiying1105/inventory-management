import { updateCategory } from './../../../../next-server/src/controllers/categoryController';


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardMetrics } from "@/types/dashboardMetrics.types";
import { Category, NewProduct, Product } from "@/types/product";
import { User } from "@/types/user";
import { Image } from "@/types/image";
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
  tagTypes: ["DashboardMetrics", "Expenses", "Products", "Users", "Expense", "Categories", "Img"], // 定义标签类型，用于缓存和更新数据
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
    // 获取产品详情
    getProductDetail: build.query<Product, { id: number }>({// 第一个泛型为返回值类型，第二个泛型为入参类型
      query: ({ id }) => `/products/detail?id=${id}`,
      providesTags: (result, error, { id }) => {// 
        return [{
          type: 'Products',
          id
        }]
      },
    }),
    // 修改产品信息
    updateProduct: build.mutation<Product, Product>({
      query: (product) => ({
        url: "/products/update",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    // 删除产品
    // deleteProduct: build.mutation<Product, { id: number }>({
    //   query: (product) => ({

    //   })
    // })
    // 上传图片
    uploadImage: build.mutation<{ url: string }, { image: File }>({
      query: ({ image }) => ({
        url: "/upload",
        method: "POST",
        body: image,
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
    }),
    // 修改产品分类
    updateCategory: build.mutation<Category, Category>({
      query: (category) => ({
        url: '/category/update',
        method: 'POST',
        body: category
      }),
    }),

    // 删除产品分类
    deleteCategory: build.mutation<Category, { id: number }>({
      query: (category) => ({
        url: '/category/delete',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: ["Categories"]
    }),

    // 获取图片分页<返回值类型，入参类型>
    getImagePage: build.query<{ list: Image[] }, { page: number, size: number }>({
      query: ({ page, size }) => ({
        url: '/picture/list',
        method: 'GET',
        params: {
          page,
          size
        }
      }),
      providesTags: ["Img"]
    }),
    // 保存图片
    savePicture: build.mutation<{ url: string }, { url: string, name: string }>({
      query: ({ url, name }) => ({
        url: '/picture/add',
        method: 'POST',
        body: { url, name },
      }),
      invalidatesTags: ["Img"]
    }),
    //登录 <返回值类型，入参类型>
    login: build.mutation<{ token: string }, { email: string, password: string }>({
      query: ({ email, password }) => ({
        url: '/auth/login',
        method: 'POST',
        body: { email, password },
      }),
    }),

  }),
})
// build.query的泛型，第一个为返回类型，第二个为查询参数类型
export const { useUpdateProductMutation, useGetProductDetailQuery, useUpdateCategoryMutation, useDeleteCategoryMutation, useLoginMutation, useSavePictureMutation, useGetImagePageQuery, useGetDashboardMetricsQuery, useGetExpensesByCategoryQuery, useGetProductsQuery, useCreateProductMutation, useGetUsersQuery, useGetCategoriesQuery, useCreateCategoryMutation, useUploadImageMutation } = api;

/**
 * 约定俗成的命名规则
 * - 以 use 开头
 * - 查询操作以 Query 结尾
 * - 增删改操作以 Mutation 结尾
 */
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

/**
 * invalidatesTags 和 providesTags 在 RTK Query 中有不同的用途：
 * 1. providesTags：
 *    - 用于Query操作
 *    - 用于指定查询操作返回的数据应该被缓存的标签。
 *    - 当查询操作返回的数据被缓存时，它会被标记为具有指定的标签。
 * 2. invalidatesTags：
 *    - 用于Mutation操作
 *    - 用于指定当某个Mutation操作被调用时，应该使哪些缓存的数据失效。
 *    - 当Mutation操作被调用时，它会使所有标记为具有指定标签的缓存数据失效，从而导致后续的查询操作重新调用接口获取最新的数据。
 */