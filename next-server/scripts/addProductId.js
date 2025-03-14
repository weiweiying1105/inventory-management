const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../prisma/seedData/products.json')

// 读取文件
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'))

// 添加 productId
const productsWithId = products.map((product, index) => ({
  productId: index + 1,
  ...product,
}))

// 写回文件
fs.writeFileSync(filePath, JSON.stringify(productsWithId, null, 2))

console.log('已成功添加 productId')
