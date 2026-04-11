# 代码检查结果与优化建议

**日期：** 2026-04-10  
**项目：** CC Scale B2B 衡器外贸平台

---

## 🔴 关键问题

### 1. 数据库种子数据缺失社交媒体内容URL
- **位置：** `packages/database/prisma/seed.ts:382-404`
- **问题：** 种子数据中没有包含以下字段：
  - `socialYoutubeContentUrl`
  - `socialFacebookContentUrl`
  - `socialLinkedInContentUrl`
  - `socialInstagramContentUrl`
  - `socialTikTokContentUrl`
- **影响：** 即使前端和后台管理界面支持社交媒体内容展示，初始数据库中也没有这些数据

### 2. WhatsApp 位置问题
- **问题描述：** WhatsApp 应该只在 Contact Info 里，社交媒体里不应该有 WhatsApp
- **检查结果：** Footer.tsx 中 WhatsApp 在 Contact Info 部分是正确的

---

## 🟡 需要优化的内容

### 3. SocialMediaShowcase 组件
- **位置：** `apps/web/components/SocialMediaShowcase.tsx`
- **问题：** 只展示链接卡片，没有真正展示社交媒体内容
- **建议：** 可以考虑嵌入社交媒体内容预览（YouTube 视频缩略图、Facebook/Instagram 帖子预览等）

### 4. 错误处理
- **位置：** `apps/web/components/SocialMediaShowcase.tsx:88-100`
- **问题：** API 调用失败时只是 console.error，没有给用户友好的提示
- **建议：** 添加错误状态展示，至少静默失败不影响其他组件

### 5. SEO 优化
- **位置：** 多个页面
- **建议：** 社交媒体内容可以添加适当的 schema.org 标记

### 6. 类型安全
- **问题：** SiteSetting 使用 key-value 存储，缺乏类型验证
- **建议：** 考虑使用 Zod 或其他验证库验证设置值

### 7. Testimonials 组件
- **位置：** `apps/web/components/Testimonials.tsx`
- **问题：** 当只有 1-2 个客户评价时，仍然显示 3 列布局，会有空白
- **建议：** 根据实际数量动态调整网格布局

### 8. 硬编码的 API URL
- **位置：** 多个组件
- **问题：** `const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';` 重复出现
- **建议：** 提取到统一的配置文件中

### 9. InquiryCartDrawer 错误处理
- **位置：** `apps/web/components/inquiry/InquiryCartDrawer.tsx:191-199`
- **问题：** catch 块直接显示 "成功"，这会误导用户
- **建议：** 添加真实的错误处理和用户提示

### 10. 数据库连接
- **位置：** `apps/api/src/site-settings/site-settings.service.ts:5-7`
- **问题：** 每个服务都创建新的 PrismaClient 实例，而不是重用 `@cc-scale/database` 包中的实例
- **建议：** 统一使用 `@cc-scale/database` 包中的 prisma 实例

### 11. 测试数据
- **建议：** 添加更多 test 用户评价，确保轮播功能有足够内容展示

### 12. 移动端优化
- **建议：** Testimonials 轮播在移动端可能需要调整触摸灵敏度和动画效果

---

## 📝 具体修复优先级

### 高优先级
1. 更新数据库种子数据，添加社交媒体内容URL字段
2. 确认 WhatsApp 在社交媒体部分没有重复展示
3. 修复 InquiryCartDrawer 的错误处理逻辑

### 中优先级
4. 统一 API URL 配置
5. 优化 Testimonials 响应式布局
6. 改进错误处理和用户反馈

### 低优先级
7. 考虑社交媒体内容预览功能
8. 添加设置值验证
9. SEO 优化
10. 数据库连接实例统一

---

## 检查的文件清单

- `apps/web/components/SocialMediaShowcase.tsx`
- `apps/web/components/Testimonials.tsx`
- `apps/web/components/Footer.tsx`
- `apps/web/components/inquiry/InquiryCartDrawer.tsx`
- `apps/web/stores/inquiry-cart.ts`
- `apps/web/app/[locale]/page.tsx`
- `apps/web/app/[locale]/layout.tsx`
- `apps/api/src/site-settings/site-settings.controller.ts`
- `apps/api/src/site-settings/site-settings.service.ts`
- `apps/api/src/inquiries/inquiries.controller.ts`
- `apps/api/src/testimonials/testimonials.controller.ts`
- `apps/api/src/main.ts`
- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/seed.ts`
- `apps/admin/app/settings/page.tsx`
