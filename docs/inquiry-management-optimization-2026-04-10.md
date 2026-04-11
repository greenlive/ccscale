# 询盘管理流程优化建议

**日期：** 2026-04-10
**项目：** CC Scale B2B 衡器外贸平台

---

## 一、当前实现分析

### 现有状态
| 状态 | 说明 | 问题 |
|------|------|------|
| NEW | 新询盘 | 无自动标记已读机制 |
| READ | 已读 | 手动标记，容易遗漏 |
| IN_PROGRESS | 处理中 | 无具体处理记录 |
| REPLIED | 已回复 | 无法区分回复方式 |
| CLOSED | 已关闭 | 无关闭原因 |
| SPAM | 垃圾 | 无spam分类依据 |

### 现有功能
- 状态快速切换
- 通过邮件/WhatsApp联系（跳转外部应用）
- 复制联系方式
- 基础筛选和搜索

### 缺失的核心功能
1. **回复方式记录** - 无法追踪通过什么方式回复
2. **回复时间追踪** - 无法知道首次回复耗时
3. **操作日志** - 无完整的处理历史
4. **跟进提醒** - 无SLA/跟进机制
5. **回复模板** - 无常用回复快速调用

---

## 二、优化方案

### 方案A：轻量级优化（推荐）

适合快速上线，改动较小，聚焦核心问题。

#### 1. 扩展 Inquiry 模型字段

```typescript
// API - 追加到现有 Inquiry 模型
model Inquiry {
  // ... 现有字段 ...

  // 回复追踪（新增）
  repliedAt: DateTime?           // 首次回复时间
  repliedBy: String?             // 回复人
  replyMethod: ReplyMethod?      // 回复方式
  closedReason: String?         // 关闭原因

  // 操作日志（新增）
  activityLogs: ActivityLog[]   // 操作历史
}

enum ReplyMethod {
  EMAIL
  WHATSAPP
  PHONE
  ALIBABA
  LINKEDIN
  OTHER
}

model ActivityLog {
  id          Int      @id @default(autoincrement())
  inquiryId   Int
  action      String   // 状态变更、添加备注、发送邮件等
  detail      String?  // 详情
  performedBy String   // 操作人
  createdAt   DateTime @default(now())

  inquiry     Inquiry  @relation(fields: [inquiryId], references: [id], onDelete: Cascade)
}
```

#### 2. UpdateInquiryDto 扩展

```typescript
// apps/api/src/inquiries/dto/inquiry.dto.ts
export class UpdateInquiryDto {
  // 现有
  status?: InquiryStatus;
  assignedToId?: number;
  notes?: string;

  // 新增
  repliedAt?: DateTime;
  repliedBy?: string;
  replyMethod?: ReplyMethod;
  closedReason?: string;
}

export class CreateActivityLogDto {
  @IsString()
  inquiryId: number;

  @IsString()
  action: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  performedBy: string;
}
```

#### 3. 状态变更触发记录

```typescript
// inquiries.service.ts
async update(id: number, updateDto: UpdateInquiryDto) {
  const oldInquiry = await this.prisma.inquiry.findUnique({ where: { id } });

  // 状态变更时自动记录日志
  if (updateDto.status && updateDto.status !== oldInquiry.status) {
    await this.createActivityLog({
      inquiryId: id,
      action: 'STATUS_CHANGE',
      detail: `${oldInquiry.status} → ${updateDto.status}`,
      performedBy: updateDto.assignedToId?.toString() || 'System',
    });
  }

  // 回复时记录
  if (updateDto.replyMethod) {
    await this.createActivityLog({
      inquiryId: id,
      action: 'REPLIED',
      detail: `通过 ${updateDto.replyMethod} 回复`,
      performedBy: updateDto.repliedBy || 'Unknown',
    });
  }

  return this.prisma.inquiry.update({ where: { id }, data: updateDto });
}
```

#### 4. 管理后台UI优化

**列表页新增列：**
- 回复方式图标
- 距创建时间（红色警告超24小时）
- 最近活动时间

**详情页新增：**
- 操作时间线（Activity Timeline）
- 快捷回复方式选择（发邮件/WhatsApp/标记电话）
- 回复后自动更新状态+记录

```tsx
// 快捷回复卡片
<div className="space-y-3">
  {/* 回复方式选择 */}
  <div className="flex gap-2">
    <Button onClick={() => handleReply('EMAIL')}>
      <Mail className="h-4 w-4 mr-1" /> 邮件回复
    </Button>
    <Button variant="secondary" onClick={() => handleReply('WHATSAPP')}>
      <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
    </Button>
    <Button variant="outline" onClick={() => handleReply('PHONE')}>
      <Phone className="h-4 w-4 mr-1" /> 电话联系
    </Button>
  </div>

  {/* 操作时间线 */}
  <div className="border-t pt-4">
    <h4 className="font-medium mb-3">处理历史</h4>
    <div className="space-y-3">
      {activityLogs.map((log) => (
        <div key={log.id} className="flex gap-3 text-sm">
          <div className="text-gray-400">{formatDate(log.createdAt)}</div>
          <div className="font-medium">{log.action}</div>
          <div className="text-gray-600">{log.detail}</div>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

### 方案B：完整B2B询盘系统

适合长期运营，需要更复杂的CRM功能。

#### 额外功能
1. **询盘优先级** - 高/中/低，自动标记大客户
2. **SLA提醒** - 24小时内必须回复，超时警告
3. **销售漏斗视图** - 看板模式管理
4. **报价关联** - 关联生成的报价单
5. **邮件模板库** - 常用回复模板
6. **批量操作** - 批量分配、批量回复
7. **数据导出** - Excel/PDF导出

#### 数据模型扩展

```typescript
model Inquiry {
  // ... 现有字段 ...

  // 优先级与归属（新增）
  priority: Priority @default(MEDIUM)  // HIGH, MEDIUM, LOW
  assignedTo: User?                  // 销售负责人
  assignedAt: DateTime?              // 分配时间

  // SLA追踪（新增）
  firstResponseAt: DateTime?         // 首次响应时间
  slaDeadline: DateTime?            // SLA截止时间
  slaBreached: Boolean @default(false)

  // 商业信息（新增）
  estimatedValue: Decimal?           // 预估订单金额
  currency: String?                 // 货币类型
  probability: Int?                 // 成交概率 %
  expectedCloseDate: DateTime?      // 预计成交日期

  // 关联（新增）
  quotes: Quote[]
  activities: Activity[]
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

model Activity {
  id          Int      @id @default(autoincrement())
  inquiryId   Int
  type        ActivityType
  content     String
  attachments String[] // 文件URLs
  createdBy  String
  createdAt   DateTime @default(now())

  inquiry     Inquiry  @relation(fields: [inquiryId], references: [id])
}

enum ActivityType {
  STATUS_CHANGE
  NOTE_ADDED
  EMAIL_SENT
  WHATSAPP_SENT
  PHONE_CALLED
  QUOTE_CREATED
  MEETING_SCHEDULED
  CUSTOMER_REPLIED
}
```

---

## 三、推荐实施路线

### Phase 1：快速止血（1-2天）
1. 添加 `replyMethod` 和 `repliedAt` 字段
2. 添加操作日志基础表
3. 状态变更自动记录
4. 详情页显示时间线

### Phase 2：体验优化（3-5天）
1. 快捷回复按钮组
2. 首次回复自动计时
3. 24小时超时警告
4. 列表页新增关键列

### Phase 3：完整CRM（长期）
1. 优先级与分配
2. 看板视图
3. 报价关联
4. 数据分析报表

---

## 四、现有数据库改动建议

如果采用方案A，需要执行以下Prisma迁移：

```prisma
// schema.prisma 修改

model Inquiry {
  // ... 现有字段 ...

  // 新增字段
  repliedAt:     DateTime?
  repliedBy:      String?
  replyMethod:    String?  // EMAIL, WHATSAPP, PHONE, ALIBABA, LINKEDIN, OTHER
  closedReason:   String?

  // 操作日志关联
  activities:     ActivityLog[]
}

model ActivityLog {
  id          Int      @id @default(autoincrement())
  inquiryId   Int
  action      String
  detail      String?
  performedBy String
  createdAt   DateTime @default(now())

  inquiry     Inquiry  @relation(fields: [inquiryId], references: [id], onDelete: Cascade)
}
```

---

## 五、总结

| 当前问题 | 优化方案 | 优先级 |
|---------|---------|--------|
| 无法追踪回复方式 | 添加replyMethod字段 | 高 |
| 无操作历史 | 添加ActivityLog表 | 高 |
| 无首次回复时间 | 添加repliedAt字段 | 高 |
| 状态变更无记录 | 状态变更自动记日志 | 高 |
| 无超时警告 | 添加24h检测+UI提示 | 中 |
| 关闭原因不明 | 添加closedReason字段 | 中 |
| 无优先级 | 添加priority字段 | 低 |
| 无看板视图 | 添加看板UI | 低 |

**建议先实施方案A的Phase 1**，快速解决核心问题，后续根据运营需求逐步完善。

---

## Phase 1 实施进度

### ✅ 已完成

#### 1. Prisma Schema 更新

**文件**: `packages/database/prisma/schema.prisma`

新增字段和模型：

```prisma
// Inquiry 模型新增字段
repliedAt:     DateTime?       // 首次回复时间
repliedBy:      String?          // 回复人
replyMethod:   ReplyMethod?     // 回复方式
closedReason:  String?          // 关闭原因

// 新增枚举
enum ReplyMethod {
  EMAIL
  WHATSAPP
  PHONE
  ALIBABA
  LINKEDIN
  OTHER
}

// 新增操作日志模型
model ActivityLog {
  id          Int      @id @default(autoincrement())
  inquiryId   Int
  action      String   // CREATED, STATUS_CHANGE, REPLIED, NOTE_ADDED, ASSIGNED
  detail      String?
  performedBy String
  createdAt   DateTime @default(now())

  inquiry     Inquiry  @relation(fields: [inquiryId], references: [id], onDelete: Cascade)
}
```

#### 2. API DTO 更新

**文件**: `apps/api/src/inquiries/dto/inquiry.dto.ts`

- 添加 `UpdateInquiryDto` 新字段：`repliedAt`, `repliedBy`, `replyMethod`, `closedReason`
- 添加 `CreateActivityLogDto` 数据传输对象

#### 3. API Service 更新

**文件**: `apps/api/src/inquiries/inquiries.service.ts`

- `findAll()` - 包含 activities 关联查询
- `findOne()` - 包含 activities 关联查询
- `update()` - 状态变更自动记录日志
- `update()` - 回复时自动记录回复方式和时间
- `createActivityLog()` - 创建活动日志方法
- `getActivityLogs()` - 获取活动日志列表方法

#### 4. API Controller 更新

**文件**: `apps/api/src/inquiries/inquiries.controller.ts`

- `GET /inquiries/:id/activities` - 获取询盘活动日志
- `POST /inquiries/:id/activities` - 添加活动日志

#### 5. 管理后台详情页更新

**文件**: `apps/admin/app/inquiries/[id]/page.tsx`

新增功能：
- 🚀 **快捷回复按钮** - 邮件/WhatsApp/电话，一键联系并自动更新状态
- 📋 **回复信息展示** - 显示回复时间、回复人、回复方式
- 📊 **操作时间线** - 完整的处理历史记录
- ⚠️ **超时警告** - 超过24小时未处理的询盘显示红色警告
- 🏷️ **回复方式标签** - 显示回复方式图标和标签

### ⏳ 待完成

- [x] 运行 Prisma 迁移（数据库同步）
- [x] 测试完整流程

### 测试验证结果

| 测试项 | 状态 |
|-------|------|
| 创建询盘 → 自动创建活动日志 | ✅ |
| 状态变更 → 自动记录日志 | ✅ |
| 快捷回复 → 标记REPLIED + 记录方式 | ✅ |
| 详情页 → 活动历史时间线显示 | ✅ |
| 24小时超时警告 | ✅ |

### 2026-04-10 手动测试截图描述

**询盘 #7 (godfuture)** 测试结果：
- 点击"邮件"快捷回复按钮
- 状态自动从"新询盘"变为"已回复"
- 处理历史显示: "状态变更: 新询盘 → 已回复, 4分钟前, Admin"

**询盘 #5 (也在)** 测试结果：
- 显示超时警告: "已超时 27 小时未处理"
- 处理历史: "暂无处理记录"
