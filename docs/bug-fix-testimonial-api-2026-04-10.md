# Bug修复记录：客户评价创建API错误

**日期：** 2026-04-10
**项目：** CC Scale B2B 衡器外贸平台
**问题：** 管理后台添加客户评价时API返回400 Bad Request错误

---

## 问题描述

在管理后台 (localhost:3001) 添加客户评价时，提交表单后API返回400错误：

```
Failed to load resource: the server responded with a status of 400 (Bad Request)
@ http://localhost:8000/api/testimonials
```

## 根本原因

**文件：** `apps/api/src/testimonials/dto/testimonial.dto.ts`

`Testimonial` DTO的 `avatarUrl` 字段使用了 `@IsUrl()` 验证器：

```typescript
@ApiPropertyOptional({ description: 'Avatar image URL' })
@IsUrl()
@IsOptional()
avatarUrl?: string;
```

问题：当管理员没有上传头像时，前端会发送空字符串 `""` 作为 `avatarUrl` 的值。`@IsUrl()` 验证器不允许空字符串，导致验证失败。

## 修复方案

使用 `@ValidateIf()` 条件验证器，只有当 `avatarUrl` 有实际内容时才进行URL格式验证：

```typescript
@ApiPropertyOptional({ description: 'Avatar image URL' })
@ValidateIf((o) => o.avatarUrl !== undefined && o.avatarUrl !== null && o.avatarUrl !== '')
@IsUrl()
@IsOptional()
avatarUrl?: string;
```

## 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `apps/api/src/testimonials/dto/testimonial.dto.ts` | 添加 `@ValidateIf()` 条件验证 |

### 修改前（第33-37行）

```typescript
@ApiPropertyOptional({ description: 'Avatar image URL' })
@IsUrl()
@IsOptional()
avatarUrl?: string;
```

### 修改后

```typescript
@ApiPropertyOptional({ description: 'Avatar image URL' })
@ValidateIf((o) => o.avatarUrl !== undefined && o.avatarUrl !== null && o.avatarUrl !== '')
@IsUrl()
@IsOptional()
avatarUrl?: string;
```

同样的修复也应用于 `UpdateTestimonialDto`（第96-100行）。

## 测试验证

### 测试步骤

1. 访问管理后台 http://localhost:3001/testimonials
2. 点击"添加评价"按钮
3. 填写表单（不上传头像）：
   - Customer Name: Claude Test User
   - Content EN: This is a test from Claude AI after fixing the bug!
   - Customer Name ZH: 克劳德测试用户
   - Content ZH: 这是Claude AI修复bug后的测试！
4. 点击"创建"按钮
5. 验证前端页面显示

### 测试结果

| 测试项 | 状态 |
|-------|------|
| 管理后台添加评价 | ✅ 成功 |
| API请求返回200 | ✅ 正常 |
| 评价列表更新 | ✅ 显示4条评价 |
| 前端显示新评价 | ✅ 正确渲染 |
| 评价分页 | ✅ 正常工作 |

### 前端显示验证

访问 http://localhost:3000/zh 验证：
- 新评价 "克劳德测试用户" 正确显示在轮播第一位
- 评价总数从3条增加到4条
- 社交媒体链接正常显示（YouTube, LinkedIn, Instagram）

## 服务重启

修复后需要重启API服务以应用更改：

```bash
# 停止旧服务
taskkill //F //PID <PID>

# 重启服务
cd apps/api && npm run dev
```

## 总结

此问题暴露了一个常见的API验证问题：当可选字段允许空值时，需要使用 `@ValidateIf()` 条件验证来避免不必要的验证失败。同样的模式适用于其他可选字段如：
- 邮箱字段（允许为空但不接受无效格式）
- 电话字段（允许为空但需符合格式）
- URL字段（允许为空但需符合URL格式）

---

**记录人：** Claude AI
**日期：** 2026-04-10
