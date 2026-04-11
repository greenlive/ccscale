# CC Scale 安全检查报告

**检查日期:** 2026-04-11  
**项目名称:** CC Scale B2B衡器外贸平台

---

## 🔴 严重安全问题

### 1. **认证Token不安全** (高危)

**位置:** `apps/api/src/auth/auth.controller.ts` 第39行

**问题描述:**
```typescript
// Generate a simple token (in production, use proper JWT)
const accessToken = Buffer.from(`${user.id}:${user.email}:${user.role}`).toString('base64');
```

**风险:**
- Token只是base64编码，没有加密或签名
- 任何人都可以解码和伪造token
- 没有过期时间，token永久有效
- 没有JWT验证机制

**修复建议:**
```typescript
import { JwtService } from '@nestjs/jwt';

// 使用JWT签名的token
const accessToken = this.jwtService.sign({
  sub: user.id,
  email: user.email,
  role: user.role,
}, {
  expiresIn: '24h',
  secret: process.env.JWT_SECRET,
});
```

---

### 2. **JWT Guard不验证Token** (高危)

**位置:** `apps/api/src/auth/guards/jwt-auth.guard.ts`

**问题描述:**
```typescript
// 只是base64解码，不验证签名或过期
const decoded = Buffer.from(token, 'base64').toString('utf-8');
```

**风险:**
- 不验证token的真实性
- 不检查token是否过期
- 任何base64编码的字符串都可以通过验证

---

### 3. **环境文件包含敏感信息** (高危)

**位置:** `.env.local`

**问题描述:**
- `.env.local` 文件已提交到仓库（虽然在.gitignore中，但文件存在）
- 包含数据库密码、API密钥等敏感信息

**修复建议:**
- 确保`.env.local`在`.gitignore`中
- 使用`.env.example`作为模板，不包含真实密码
- 生产环境使用环境变量管理系统

---

## 🟡 中等安全问题

### 4. **缺少速率限制** (中危)

**位置:** `apps/api/src/auth/auth.controller.ts` - `/login` 端点

**风险:**
- 没有登录尝试次数限制
- 容易受到暴力破解攻击
- 询盘提交端点也没有速率限制

**修复建议:**
```typescript
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Post('login')
async login(@Body() loginDto: LoginDto) { ... }
```

---

### 5. **缺少输入验证** (中危)

**位置:** `apps/api/src/inquiries/inquiries.controller.ts`

**风险:**
- 虽然使用了DTO，但需要确认所有输入都有适当的验证
- 缺少XSS防护
- 询盘消息应该进行内容安全检查

**修复建议:**
```typescript
// 在DTO中添加更严格的验证
import { IsString, IsEmail, MaxLength, Matches } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(2000)
  @Matches(/^[a-zA-Z0-9\s\.,!?'-]*$/, { message: 'Invalid characters' })
  message: string;
}
```

---

### 6. **Inquiry更新端点没有认证** (中危)

**位置:** `apps/api/src/inquiries/inquiries.controller.ts` 第76-82行

**问题描述:**
```typescript
@Put(':id')
update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
  return this.inquiriesService.update(parseInt(id), updateInquiryDto);
}
```

**风险:**
- 任何人都可以修改询盘信息
- 没有身份验证和授权
- 可能被用来篡改客户询盘

**修复建议:**
```typescript
@Put(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
@ApiBearerAuth()
update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
  return this.inquiriesService.update(parseInt(id), updateInquiryDto);
}
```

---

### 7. **缺少SQL注入防护检查** (中危)

**风险:**
- 虽然使用Prisma ORM（自动参数化查询），但需要确认
- 需要确保没有原始SQL查询使用字符串拼接

**检查结果:**
- Prisma schema看起来正确
- 需要确保代码中没有`$queryRaw`使用字符串拼接

---

## 🟢 低风险安全问题

### 8. **密码哈希轮数可能不足** (低危)

**位置:** `apps/api/src/auth/auth.service.ts` 第9行

**问题描述:**
```typescript
private readonly SALT_ROUNDS = 10;
```

**建议:**
- 考虑提高到12或14轮（权衡安全性和性能）
- 当前10轮是可接受的，但可以增强

---

### 9. **缺少安全头** (低危)

**位置:** Next.js和NestJS配置

**建议添加的安全头:**
```typescript
// NestJS main.ts
app.use(helmet());

// Next.js next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ];
}
```

---

### 10. **CORS配置可能过于宽松** (低危)

**位置:** `apps/api/src/main.ts`

**建议:**
- 生产环境应该明确指定允许的域名
- 不要使用通配符`*`

---

## 📋 安全配置检查清单

### 已正确实施的安全措施:
✅ 使用bcrypt进行密码哈希  
✅ Prisma ORM防止SQL注入  
✅ 有基本的角色权限系统  
✅ 敏感字段（密码）不在API响应中返回  
✅ `.gitignore`包含环境文件  

### 需要立即修复的:
🔴 Token认证系统 - 改用JWT  
🔴 Inquiry更新端点认证  
🔴 确保环境文件安全  
🟡 添加速率限制  
🟡 加强输入验证  

---

## 🔐 生产环境安全检查清单

部署前必须完成:

- [ ] 使用真实的JWT认证，有签名和过期时间
- [ ] 所有API端点有适当的认证和授权
- [ ] 添加速率限制防止暴力攻击
- [ ] 配置Helmet安全头
- [ ] 使用强密码和密钥管理
- [ ] 配置HTTPS（TLS 1.2+）
- [ ] 设置安全的CORS策略
- [ ] 添加请求日志和监控
- [ ] 配置数据库访问权限限制
- [ ] 添加安全扫描到CI/CD流程
- [ ] 设置定期安全审计

---

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/overview)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)

---

**报告生成时间:** 2026-04-11  
**下次审计建议:** 3个月内或重大功能更新后
