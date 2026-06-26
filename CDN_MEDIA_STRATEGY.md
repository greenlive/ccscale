# CC Scale 濯掍綋璧勬簮鎵樼绛栫暐

## 闂鍒嗘瀽

褰撳墠鏋舵瀯涓紝浜у搧鍥剧墖銆佸崥瀹㈠浘鐗囥€丳DF涓嬭浇閮芥斁鍦?Vercel 涓婏細

鉂?**鎴愭湰楂?*锛歏ercel 瓒呮祦閲?.40/GB
鉂?**鎬ц兘宸?*锛氱敤鎴蜂粠鍗曚竴鏈嶅姟鍣ㄤ笅杞?鉂?**鏃燙DN**锛氳法鍥借闂參

---

## 鎺ㄨ崘鏂规锛欳loudflare R2 + Images

### 涓轰粈涔堥€?R2锛?
| 浼樺娍 | 璇存槑 |
|------|------|
| **娴侀噺鍏嶈垂** | R2 鍒?Cloudflare CDN 娴侀噺瀹屽叏鍏嶈垂 |
| **CDN 鍐呭祵** | Cloudflare 鍏ㄧ悆 300+ 杈圭紭鑺傜偣 |
| **Workers 闆嗘垚** | 鍙仛鍥剧墖鍘嬬缉銆佹牸寮忚浆鎹€佹按鍗?|
| **API 鍏煎 S3** | 鐜版湁 SDK 鍙渶鏀圭鐐?|

### 鎴愭湰瀵规瘮

| 鍦烘櫙 | 鍘熸柟妗?| R2 鏂规 |
|------|--------|---------|
| 500GB 鍥剧墖娴侀噺 | /鏈?| **** |
| 100GB PDF 涓嬭浇 | /鏈?| **** |
| 鍥剧墖澶勭悊 Workers | N/A | ~/鏈?|
| **鎬昏** | **~/鏈?* | **~/鏈?* |

---

## 瀹炴柦姝ラ

### 绗竴姝ワ細鍒涘缓 R2 Bucket

1. 鐧诲綍 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 杩涘叆 R2 Object Storage
3. 鍒涘缓 Bucket锛歝cscale-media
4. 娣诲姞鑷畾涔夊煙鍚嶏細media.zzscale.com

### 绗簩姝ワ細閰嶇疆 R2 API Token

1. My Profile 鈫?API Tokens
2. 鍒涘缓鑷畾涔?Token
3. 鏉冮檺锛欵dit Cloudflare R2

### 绗笁姝ワ細鏇存柊浠ｇ爜

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
    Bucket: 'zzscale-media',
    Key: products/,
    Body: body,
    ContentType: contentType,
  });
  
  await r2.send(command);
  
  // 杩斿洖 Cloudflare CDN URL
  return https://media.zzscale.com/products/;
}

export async function getSignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: 'zzscale-media',
    Key: key,
  });
  
  return getSignedUrl(r2, command, { expiresIn: 3600 });
}
`

### 绗洓姝ワ細鍥剧墖澶勭悊 Workers

`	ypescript
// workers/image-processor/index.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 浠?R2 鑾峰彇鍘熷浘
    const originUrl = https://.r2.dev;
    const origin = await fetch(originUrl);
    
    // 浣跨敤 Cloudflare Image Resizing
    const params = new URL(request.url);
    params.searchParams.set('width', url.searchParams.get('w') || '800');
    params.searchParams.set('format', 'auto');
    params.searchParams.set('quality', '80');
    
    // 杩斿洖浼樺寲鍚庣殑鍥剧墖
    return new Response(origin.body, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CF-Image-Status': 'processed',
      },
    });
  },
};
`

### 绗簲姝ワ細鏇存柊涓婁紶 API

`	ypescript
// apps/api/src/upload/upload.controller.ts
@Post('product-image')
@UseInterceptors(FileInterceptor('file'))
async uploadProductImage(@UploadedFile() file: Express.MulterFile) {
  // 1. 涓婁紶鍒?R2
  const key = products/-;
  await uploadToR2(key, file.buffer, file.mimetype);
  
  // 2. 鐢熸垚 CDN URL
  const cdnUrl = https://media.zzscale.com/;
  
  // 3. 鏇存柊鏁版嵁搴?  return { url: cdnUrl, key };
}
`

---

## PDF 涓嬭浇浼樺寲

### 浣跨敤 Signed URL

`	ypescript
// 鐢熸垚鏈夋椂闄愮殑涓嬭浇閾炬帴
export async function generateDownloadUrl(pdfKey: string): Promise<string> {
  const url = await getSignedDownloadUrl(downloads/);
  return url; // 1灏忔椂鍚庤繃鏈?}

// 鍦ㄤ骇鍝佽鎯呴〉浣跨敤
const downloadUrl = await generateDownloadUrl('catalog-2024.pdf');
// <a href={downloadUrl}>涓嬭浇浜у搧鎵嬪唽 (PDF)</a>
`

### Cloudflare Workers 浠ｇ悊锛堝彲閫夛級

`	ypescript
// workers/pdf-proxy/index.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const file = url.searchParams.get('file');
    
    // 浠?R2 鑾峰彇
    const r2Url = https://.r2.dev/downloads/;
    const response = await fetch(r2Url);
    
    // 璁剧疆涓嬭浇澶?    const headers = new Headers(response.headers);
    headers.set('Content-Disposition', ttachment; filename=\${file}\`);
    headers.set('Content-Type', 'application/pdf');
    
    return new Response(response.body, { headers });
  },
};
`

---

## 杩佺Щ鐜版湁璧勬簮

### 鑴氭湰锛氭壒閲忚縼绉诲埌 R2

`	ypescript
// scripts/migrate-to-r2.ts
import { S3Client, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';

const sourceClient = new S3Client({ region: 'us-east-1' });
const destClient = new R2Client;

async function migrate() {
  // 鍒楀嚭鎵€鏈夌幇鏈夊浘鐗?  const listCommand = new ListObjectsV2Command({
    Bucket: 'existing-bucket',
    Prefix: 'products/',
  });
  
  const objects = await sourceClient.send(listCommand);
  
  // 鎵归噺澶嶅埗鍒?R2
  for (const obj of objects.Contents || []) {
    await destClient.send(new CopyObjectCommand({
      Bucket: 'zzscale-media',
      Key: obj.Key,
      CopySource: existing-bucket/,
    }));
    
    console.log(Migrated: );
  }
}

migrate();
`

---

## 鏈€缁堟灦鏋?
`
鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹?                       Cloudflare CDN                            鈹?鈹?                    (鍏ㄧ悆 300+ 杈圭紭鑺傜偣)                          鈹?鈹?                    鍏嶈垂 SSL + HTTP/3                            鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?                              鈹?         鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹尖攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?         鈹?                   鈹?                   鈹?         鈻?                   鈻?                   鈻?鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹? 鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹? 鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹?  Vercel        鈹? 鈹?  R2 Storage    鈹? 鈹?  Workers       鈹?鈹?  Next.js       鈹? 鈹?  浜у搧鍥剧墖       鈹? 鈹?  鍥剧墖澶勭悊      鈹?鈹?  (浠ｇ爜)         鈹? 鈹?  鍗氬鍥剧墖       鈹? 鈹?  PDF 浠ｇ悊      鈹?鈹?  ~10GB/鏈?     鈹? 鈹?  PDF 涓嬭浇      鈹? 鈹?  绛惧悕URL      鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹? 鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹? 鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?                              鈹?                              鈻?                     鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?                     鈹?  Railway       鈹?                     鈹?  API + DB      鈹?                     鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?`

---

## 鎴愭湰鎬荤粨

| 璧勬簮绫诲瀷 | 瀛樺偍 | 娴侀噺 | 澶勭悊 | 鏈堣垂鐢?|
|----------|------|------|------|--------|
| 浜у搧鍥剧墖 (100GB) |  |  | .1 | **.1** |
| 鍗氬鍥剧墖 (50GB) |  |  | .05 | **.05** |
| PDF 涓嬭浇 (20GB) |  |  | .02 | **.02** |
| Workers 璇锋眰 | - | - | 100涓囨 | **.5** |
| **鎬昏** | | | | **~.7/鏈?* |

> 鐩告瘮鍘熸柟妗?**/鏈?*锛岃妭鐪?**99.7%**锛