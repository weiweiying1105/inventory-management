import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// 转换文件名为 PascalCase
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/) // 处理 `snake_case` 或 `kebab-case`
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) =>
    toPascalCase(path.basename(fileName, path.extname(fileName)))
  );

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];

    if (model) {
      try {
        await model.deleteMany({});
        console.log(`✅ Cleared data from ${modelName}`);
      } catch (error) {
        console.error(`❌ Failed to clear data from ${modelName}: ${(error as Error).message}`);
      }
    } else {
      console.error(`⚠️ Model ${modelName} not found. Please ensure the model name is correctly specified.`);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "products.json",
    "expenseSummary.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
    "users.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  console.log("🔄 Starting data deletion...");
  await deleteAllData(orderedFileNames);
  console.log("✅ Data deletion complete.");

  console.log("🔄 Starting data seeding...");
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`⚠️ File not found: ${filePath}`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = toPascalCase(path.basename(fileName, path.extname(fileName)));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`⚠️ No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      try {
        await model.create({ data });
      } catch (error) {
        console.error(`❌ Error seeding ${modelName} with data from ${fileName}: ${(error as Error).message}`);
      }
    }

    console.log(`✅ Seeded ${modelName} with data from ${fileName}`);
  }

  console.log("🎉 Data seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error in seeding process:", (e as Error).message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
