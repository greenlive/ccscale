# CC Scale - B2B衡器外贸平台

专业的衡器外贸B2B平台，采用极简工业风设计。

## 技术栈

- **Monorepo**: Turborepo
- **前台**: Next.js 15 + React 19 + Tailwind CSS
- **后台**: Next.js 15 + shadcn/ui
- **API**: NestJS 10 + Prisma
- **数据库**: PostgreSQL + Redis + Meilisearch

## 开发

```bash
# 安装依赖
npm install

# 启动全部服务
docker-compose up -d
npm run dev
```

## 项目结构

```
apps/
  web/          # 前台网站
  admin/        # 后台管理
  api/          # NestJS API服务
packages/
  ui/           # 共享UI组件
  shared-types/ # 共享TypeScript类型
  i18n/         # 多语言翻译
  database/     # Prisma数据库
```

## 前台 UI 设计说明（`apps/web`）

- **视觉风格**：深蓝主色（工业/B2B 可信感）+ 橙色强调色；首页 Hero 使用毛玻璃内容区与轻量光晕，传递「专业但不冰冷」的品牌气质。
- **多语言**：文案集中在 `apps/web/messages/*.json`；导航、页脚快速链接、跳过链接与社交媒体区块标题等均走翻译键，避免中英文硬编码混用。
- **多终端**：顶栏使用 `backdrop-blur` 与 `safe-area-inset` 适配刘海屏；正文区预留底部安全区；全局 `prefers-reduced-motion` 下减弱动画；触控目标在 `globals.css` 中已加粗指针设备上的最小点击区域。
- **新媒体与 AI**：主导航包含「博客资讯」与「AI摘要」（`/ai-summary`，供大模型/助手抓取的结构化企业页），AI 入口带图标以区别于普通栏目。
- **字体**：`packages/ui` 的 `fontFamily.sans` 在 Inter 基础上补充「苹方 / 微软雅黑 / Noto Sans SC」，改善中文可读性。

设计源文件为 React 组件 + Tailwind（仓库内无独立 `.pen` 稿）；若使用 Pencil 等工具出稿，可将链接或导出规范附在文档中供团队协作。
