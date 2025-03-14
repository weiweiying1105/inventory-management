- cnpm i prisma @prisma/client
- npx prisma init
- npx tsc --init
- cnpm i -d typescript ts-node @types/node @prisma/client
- npx prisma genetate

- npm i express body-parser cors dotenv helmet morgan concurrently
- npm i nodemon @types/cors @types/express @types/morgan
- server = postgres;database=inventorymanagement;port=3600

// 这两条命令的作用是：
// 1. 创建一个迁移文件，用于记录数据库的变化
// 2. 执行迁移文件，将数据库的变化应用到数据库中
// 3. 执行种子文件，将数据插入到数据库中
// 4. 启动服务器
// 5. 监听数据库的变化，并自动应用到数据库中
// 6. 监听文件的变化，并自动重启服务器

- npx prisma migrate dev --name nit
- npx run seed

// 1.创建 controller，操作数据库
// 2.创建 router，调用 controller
// 3.app.use('/', router)
// 4. client 端 api 里，使用 Redux-toolkit 的 thunk 中间件，调用 router 里的函数，获取数据
// 4.1 import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// 4.2 createApi 的 tagTypes 里，定义了数据的类型
// 4.3 createApi 的 endpoints 里，定义了数据的接口，使用 query 方法，调用 router 里的函数，获取数据

// 5. client 端组件里，使用 useSelector 获取数据，使用 useDispatch 调用 router 里的函数，更新数据
// 6. client 端组件里，使用 useEffect，监听数据的变化，更新组件

---

##### build.query 和 build.mutation

- build.query 和 build.mutation 是 Redux Toolkit Query 提供的两个函数，用于创建查询和突变（mutation）的 API 请求。

- build.query 用于创建查询请求，它接受一个对象作为参数，该对象包含以下属性：

  - query: 一个函数，用于生成请求的 URL 和参数。它接受一个参数，该参数是一个对象，包含查询参数和请求体。
  - transformResponse: 一个函数，用于处理响应数据。它接受一个参数，该参数是响应数据，返回一个处理后的数据。
  - provides: 一个数组，用于指定查询请求提供的数据类型。它接受一个参数，该参数是一个对象，包含查询参数和请求体。

- build.mutation 用于创建突变请求，它接受一个对象作为参数，该对象包含以下属性：
  - mutation: 一个函数，用于生成请求的 URL 和参数。它接受一个参数，该参数是一个对象，包含突变参数和请求体。
  - transformResponse: 一个函数，用于处理响应数据。它接受一个参数，该参数是响应数据，返回一个处理后的数据。
  - invalidates: 一个数组，用于指定突变请求无效的数据类型。它接受一个参数，该参数是一个对象，包含突变参数和请求体。

##### 新增产品的时候，把产品 id 改成自增的，但是现有数据库中的不变

- 首先修改 schema.prisma
  model Products{
  productId Int @id @default(autoincrement())  
  ...其他字段
  }
- 创建一个新的迁移，保留现有数据
  npx prisma migrate dev --name product_id_autoincrement --create-only
