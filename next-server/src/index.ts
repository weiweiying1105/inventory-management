import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// 路由引入
import dashboard from './routes/dashboardRoute'
import products from './routes/productRoute'
import User from './routes/userRoute'
import expense from './routes/expenseRoute'
import category from './routes/categoryRoute'
import uploadRouter from './routes/upload';
import PictureRouter from './routes/pictureRoute'
import AuthRouter from './routes/authRoute'
//------------------------------------------------ 配置

// mini路由
import minihome from './routes/mini/homeRoute'
import miniAuth from './routes/mini/authRoute'

dotenv.config()
const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'inventory-management',
      description: '商城后管',
      version: '1.0.0',
    },
  },
  // 这里指定你的路由文件位置
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
// helmet 是一个用于设置 HTTP 头的中间件，可以防止一些常见的 Web 攻击，如跨站脚本攻击（XSS）和跨站请求伪造（CSRF）。
app.use(helmet());
// helmet设置一个跨域资源共享（CORS）策略，允许来自特定来源的请求访问资源。这可以防止跨站请求伪造（CSRF）攻击。
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
/**
 *  morgan 是一个用于记录 HTTP 请求的中间件，可以记录请求的 URL、方法、状态码等信息，方便调试和监控。
 *  参数common是一个预定义的格式，包含了请求的 URL、方法、状态码、响应时间等信息。
 *  */
app.use(morgan('common'));

app.use(bodyParser.json());
// bodyParser.urlencoded({ extended: false })表示解析 URL 编码的数据，extended: false 表示使用系统模块 querystring 来解析数据，而 extended: true 则表示使用第三方模块 qs 来解析数据。
app.use(bodyParser.urlencoded({ extended: false }));
//是 cors 中间件的一个函数，用于设置跨域资源共享（CORS）策略，允许来自特定来源的请求访问资源。
app.use(cors());

// ------------------------------------------------ 路由
app.use('/dashboard', dashboard)
app.use('/products', products)
app.use('/users', User)
app.use('/expenses', expense)
app.use('/category', category)
app.use('/upload', uploadRouter)
app.use('/picture', PictureRouter)
app.use('/auth', AuthRouter)
// ------------------------------------------------ server
// 小程序
app.use('/mini', minihome)
app.use('/mini', miniAuth)

// 小程序------------------------------------------end
const port = Number(process.env.PORT) || 3001;
// 需要添加0.0.0.0来代表监听所有可用的网络接口，而不仅仅是 localhost。
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
