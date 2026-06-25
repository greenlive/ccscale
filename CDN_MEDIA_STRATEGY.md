# CC Scale 媒体资源托管策略

## 问题分析

当前架构中，产品图片、博客图片、PDF下载都放在 Vercel 上：

❌ **成本高**：Vercel 超流量 .40/GB
❌ **性能差**：用户从单一服务器下载
❌ **无CDN**：跨国访问慢

---

## 推荐方案：Cloudflare R2 + Images

### 为什么选 R2？

| 优势 | 说明 |
|------|------|
| **流量免费** | R2 到 Cloudflare CDN 流量完全免费 |
| **CDN 内嵌** | Cloudflare 全球 300+ 边缘节点 |
| **Workers 集成** | 可做图片压缩、格式转换、水印 |
| **API 兼容 S3** | 现有 SDK 只需改端点 |

### 成本对比

| 场景 | 原方案 | R2 方案 |
|------|--------|---------|
| 500GB 图片流量 | /月 | **** |
| 100GB PDF 下载 | /月 | **** |
| 图片处理 Workers | N/A | ~/月 |
| **总计** | **~/月** | **~/月** |

---

## 实施步骤

### 第一步：创建 R2 Bucket

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 R2 Object Storage
3. 创建 Bucket：ccscale-media
4. 添加自定义域名：media.ccscale.com

### 第二步：配置 R2 API Token

1. My Profile → API Tokens
2. 创建自定义 Token
3. 权限：Edit Cloudflare R2

### 第三步：更新代码

`	ypescript
// lib/storage/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: https://.r2.cloudflarestorage.com,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadProductImage(
  key: string, 
  body: Buffer, 
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: 'ccscale-media',
    Key: products/,
    Body: body,
    ContentType: contentType,
  });
  
  await r2.send(command);
  
  // 返回 Cloudflare CDN URL
  return https://media.ccscale.com/products/;
}

export async function getSignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: 'ccscale-media',
    Key: key,
  });
  
  return getSignedUrl(r2, command, { expiresIn: 3600 });
}
`

### 第四步：图片处理 Workers

`	ypescript
// workers/image-processor/index.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 从 R2 获取原图
    const originUrl = https://.r2.dev;
    const origin = await fetch(originUrl);
    
    // 使用 Cloudflare Image Resizing
    const params = new URL(request.url);
    params.searchParams.set('width', url.searchParams.get('w') || '800');
    params.searchParams.set('format', 'auto');
    params.searchParams.set('quality', '80');
    
    // 返回优化后的图片
    return new Response(origin.body, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CF-Image-Status': 'processed',
      },
    });
  },
};
`

### 第五步：更新上传 API

`	ypescript
// apps/api/src/upload/upload.controller.ts
@Post('product-image')
@UseInterceptors(FileInterceptor('file'))
async uploadProductImage(@UploadedFile() file: Express.MulterFile) {
  // 1. 上传到 R2
  const key = products/-;
  await uploadToR2(key, file.buffer, file.mimetype);
  
  // 2. 生成 CDN URL
  const cdnUrl = https://media.ccscale.com/;
  
  // 3. 更新数据库
  return { url: cdnUrl, key };
}
`

---

## PDF 下载优化

### 使用 Signed URL

`	ypescript
// 生成有时限的下载链接
export async function generateDownloadUrl(pdfKey: string): Promise<string> {
  const url = await getSignedDownloadUrl(downloads/);
  return url; // 1小时后过期
}

// 在产品详情页使用
const downloadUrl = await generateDownloadUrl('catalog-2024.pdf');
// <a href={downloadUrl}>下载产品手册 (PDF)</a>
`

### Cloudflare Workers 代理（可选）

`	ypescript
// workers/pdf-proxy/index.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const file = url.searchParams.get('file');
    
    // 从 R2 获取
    const r2Url = https://.r2.dev/downloads/;
    const response = await fetch(r2Url);
    
    // 设置下载头
    const headers = new Headers(response.headers);
    headers.set('Content-Disposition', ttachment; filename=\${file}\`);
    headers.set('Content-Type', 'application/pdf');
    
    return new Response(response.body, { headers });
  },
};
`

---

## 迁移现有资源

### 脚本：批量迁移到 R2

`	ypescript
// scripts/migrate-to-r2.ts
import { S3Client, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';

const sourceClient = new S3Client({ region: 'us-east-1' });
const destClient = new R2Client;

async function migrate() {
  // 列出所有现有图片
  const listCommand = new ListObjectsV2Command({
    Bucket: 'existing-bucket',
    Prefix: 'products/',
  });
  
  const objects = await sourceClient.send(listCommand);
  
  // 批量复制到 R2
  for (const obj of objects.Contents || []) {
    await destClient.send(new CopyObjectCommand({
      Bucket: 'ccscale-media',
      Key: obj.Key,
      CopySource: existing-bucket/,
    }));
    
    console.log(Migrated: );
  }
}

migrate();
`

---

## 最终架构

`
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare CDN                            │
│                     (全球 300+ 边缘节点)                          │
│                     免费 SSL + HTTP/3                            │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Vercel        │  │   R2 Storage    │  │   Workers       │
│   Next.js       │  │   产品图片       │  │   图片处理      │
│   (代码)         │  │   博客图片       │  │   PDF 代理      │
│   ~10GB/月      │  │   PDF 下载      │  │   签名URL      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   Railway       │
                     │   API + DB      │
                     └─────────────────┘
`

---

## 成本总结

| 资源类型 | 存储 | 流量 | 处理 | 月费用 |
|----------|------|------|------|--------|
| 产品图片 (100GB) |  |  | .1 | **.1** |
| 博客图片 (50GB) |  |  | .05 | **.05** |
| PDF 下载 (20GB) |  |  | .02 | **.02** |
| Workers 请求 | - | - | 100万次 | **.5** |
| **总计** | | | | **~.7/月** |

> 相比原方案 **/月**，节省 **99.7%**！