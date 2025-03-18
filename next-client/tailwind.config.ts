
import type { Config } from "tailwindcss";
import { createThemes } from "tw-colors";
import colors from "tailwindcss/colors";
const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
];

const shadeMapping = {
  "50": "900",
  "100": "800",
  "200": "700",
  "300": "600",
  "400": "500",
  "500": "400",
  "600": "300",
  "700": "200",
  "800": "100",
  "900": "50",
};
// 修改类型定义
type ShadeMapping = Record<string, string>; // 改为接受字符串类型的值

function generateThemeObject(
  colors: any,  // 修改类型定义，因为 tailwindcss 的颜色类型比较复杂
  shadeMapping: ShadeMapping,
  isDark: boolean = false
) {
  const theme: Record<string, Record<string, string>> = {};
  baseColors.forEach((color) => {
    theme[color] = {};
    Object.entries(shadeMapping).forEach(([shade, value]) => {
      const shadeKey = isDark ? value : shade;
      if (colors[color]?.[shadeKey]) {  // 添加安全检查
        theme[color][shade] = colors[color][shadeKey];
      }
    });
  });
  return theme;
}

const lightTheme = generateThemeObject(colors, shadeMapping);
const darkTheme = generateThemeObject(colors, shadeMapping, true);

const themes = {
  light: {
    ...lightTheme,
    white: "#fff",
  },
  dark: {
    ...darkTheme,
    white: colors.gray[900],
    black: colors.gray[50],
  }
}
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    createThemes(themes),
  ],
} satisfies Config;
