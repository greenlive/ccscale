# CC Scale 閮ㄧ讲鎸囧崡

## 閮ㄧ讲鏋舵瀯

`
Cloudflare (CDN/DNS)
    鈹?    鈻?鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹? Vercel - Web 鍓嶇                           鈹?鈹? https://www.zzscale.com                      鈹?鈹? - Next.js SSR/ISR                            鈹?鈹? - 鍏ㄧ悆杈圭紭鍒嗗彂                                鈹?鈹? - next-intl 澶氳瑷€                            鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?    鈹?    鈹?API 璇锋眰
    鈻?鈹屸攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?鈹? Railway - API 鍚庣                           鈹?鈹? https://api-zzscale.up.railway.app           鈹?鈹? - NestJS REST API                           鈹?鈹? - Prisma ORM                                鈹?鈹? - JWT 璁よ瘉                                   鈹?鈹斺攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹?    鈹?    鈹溾攢鈹€ PostgreSQL (Railway 鎵樼)
    鈹溾攢鈹€ Redis (Railway 鎵樼)
    鈹斺攢鈹€ Meilisearch (鍙€?Railway 鎻掍欢)
`

## 鍓嶇疆鍑嗗

### 1. 娉ㄥ唽璐﹀彿

- [Vercel](https://vercel.com) - GitHub 鐧诲綍
- [Railway](https://railway.app) - GitHub 鐧诲綍
- [Cloudflare](https://cloudflare.com) - 鍏嶈垂璐﹀彿

### 2. Fork 椤圭洰鍒?GitHub

`ash
# 濡傛灉杩樻病鏈?GitHub 浠撳簱
git init
git add .
git commit -m ""Initial commit: CC Scale B2B platform""
git remote add origin https://github.com/YOUR_USERNAME/cc-scale.git
git push -u origin main
`

---

## 閮ㄧ讲姝ラ

### 绗竴闃舵锛氶儴缃插悗绔?API (Railway)

#### 1. 鍒涘缓 Railway 椤圭洰

1. 鐧诲綍 [Railway](https://railway.app)
2. 鐐瑰嚮 ""New Project"" 鈫?""Deploy from GitHub repo""
3. 閫夋嫨 cc-scale 浠撳簱
4. 閫夋嫨 pps/api 浣滀负鏍圭洰褰?
#### 2. 閰嶇疆鐜鍙橀噺

鍦?Railway 椤圭洰璁剧疆涓坊鍔犱互涓嬬幆澧冨彉閲忥細

`
DATABASE_URL=postgresql://user:password@host:5432/zzscale
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=production
PORT=8000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# CORS (Vercel 閮ㄧ讲鍚庣殑URL)
CORS_ORIGIN=https://www.zzscale.com,https://zzscale.vercel.app
`

#### 3. 娣诲姞鏁版嵁搴?
1. Railway Dashboard 鈫?Add Plugin 鈫?PostgreSQL
2. Railway 浼氳嚜鍔ㄨ缃?DATABASE_URL
3. 杩愯鏁版嵁搴撹縼绉伙細
   `ash
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed  # 绉嶅瓙鏁版嵁
   `

#### 4. 娣诲姞 Redis (鍙€?

1. Railway Dashboard 鈫?Add Plugin 鈫?Upstash Redis
2. 鎴栦娇鐢?Railway 鑷甫鐨?Redis 鎻掍欢

#### 5. 鑾峰彇 API URL

閮ㄧ讲鎴愬姛鍚庯紝Railway 浼氭彁渚涚被浼?https://api-zzscale.up.railway.app 鐨?URL銆?
---

### 绗簩闃舵锛氶儴缃插墠绔?(Vercel)

#### 1. 鍒涘缓 Vercel 椤圭洰

1. 鐧诲綍 [Vercel](https://vercel.com)
2. 鐐瑰嚮 ""Add New"" 鈫?""Project""
3. 閫夋嫨 cc-scale 浠撳簱
4. 閰嶇疆鏋勫缓璁剧疆锛?
`
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build --filter=@cc-scale/web
Output Directory: .next
Install Command: npm ci
`

#### 2. 閰嶇疆鐜鍙橀噺

`
NEXT_PUBLIC_API_URL=https://api-zzscale.up.railway.app
NEXT_PUBLIC_WEB_URL=https://www.zzscale.com
NODE_ENV=production
`

#### 3. 娣诲姞鑷畾涔夊煙鍚?
1. 椤圭洰 Settings 鈫?Domains
2. 娣诲姞 www.zzscale.com
3. 娣诲姞 zzscale.com (閲嶅畾鍚戝埌 www)

---

### 绗笁闃舵锛氶厤缃?Cloudflare

#### 1. 娣诲姞鍩熷悕

1. 鐧诲綍 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 娣诲姞 zzscale.com 鍩熷悕
3. 鏇存柊鍩熷悕娉ㄥ唽鍟嗙殑 NS 鏈嶅姟鍣?
#### 2. 閰嶇疆 DNS

`
Type    Name    Content                 Proxy Status
A       @       [Railway IP]           DNS Only
A       api     [Railway IP]           DNS Only
CNAME   www     c-scale-web.vercel.app CDN
`

#### 3. 璁剧疆椤甸潰瑙勫垯

1. 寮哄埗 HTTPS
2. 缂撳瓨浼樺寲
3. 瀹夊叏璁剧疆

---

## 楠岃瘉閮ㄧ讲

### 妫€鏌ユ竻鍗?
- [ ] 鍓嶇 https://www.zzscale.com/en 鍙闂?- [ ] 涓枃鐗?https://www.zzscale.com/zh 鍙闂?- [ ] API https://api-zzscale.up.railway.app/api/health 杩斿洖 200
- [ ] 浜у搧椤甸潰姝ｇ‘鍔犺浇
- [ ] 鍥剧墖姝ｅ父鏄剧ず
- [ ] 澶氳瑷€鍒囨崲姝ｅ父
- [ ] Schema.org 缁撴瀯鍖栨暟鎹湁鏁?- [ ] robots.txt 鍙闂?
### SEO 楠岃瘉

`ash
# 妫€鏌?sitemap
curl https://www.zzscale.com/en/sitemap.xml

# 妫€鏌?robots.txt
curl https://www.zzscale.com/robots.txt

# 妫€鏌?hreflang
curl -I https://www.zzscale.com/en | grep -i link
`

---

## 鐩戞帶鍜岀淮鎶?
### Vercel Analytics

1. 椤圭洰 Settings 鈫?Analytics
2. 鏌ョ湅 Core Web Vitals 鏁版嵁

### Railway 鐩戞帶

1. Railway Dashboard 鈫?椤圭洰 鈫?Metrics
2. 鏌ョ湅璇锋眰閲忋€佸搷搴旀椂闂淬€侀敊璇巼

### 閿欒杩借釜

- Sentry 宸查厤缃湪 Next.js 涓?- 璁剧疆 Sentry DSN 鐜鍙橀噺

---

## 鏇存柊閮ㄧ讲

### 鑷姩閮ㄧ讲

Vercel 鍜?Railway 閮芥敮鎸?GitHub 闆嗘垚锛屼唬鐮佹帹閫佸埌 main 鍒嗘敮鍚庤嚜鍔ㄩ儴缃层€?
### 鎵嬪姩閮ㄧ讲

`ash
# Vercel
cd apps/web
vercel --prod

# Railway
railway up
`

---

## 鎴愭湰浼扮畻

| 鏈嶅姟 | 鏂规 | 鏈堣垂鐢?|
|------|------|--------|
| Vercel | Hobby |  |
| Railway | Starter |  (1000 灏忔椂) |
| Cloudflare | Free |  |
| **鎬昏** | | **/鏈?* |

> 濡傛灉娴侀噺涓嶅ぇ锛孯ailway 鐨勫厤璐归搴︼紙500灏忔椂/鏈堬級閫氬父澶熺敤銆?
---

## 鏁呴殰鎺掗櫎

### 鍓嶇鏋勫缓澶辫触

`ash
# 鏈湴娴嬭瘯鏋勫缓
npm run build --filter=@cc-scale/web
`

### API 杩炴帴澶辫触

1. 妫€鏌?NEXT_PUBLIC_API_URL 鏄惁姝ｇ‘
2. 妫€鏌?Railway 鐨?CORS 閰嶇疆
3. 鏌ョ湅 Railway 鏃ュ織

### 鏁版嵁搴撹繛鎺ラ棶棰?
`ash
# Railway 涓繛鎺ユ暟鎹簱
railway run psql 

# 杩愯杩佺Щ
railway run npx prisma migrate deploy
`

---

## 蹇€熼摼鎺?
- [Vercel 鏂囨。](https://vercel.com/docs)
- [Railway 鏂囨。](https://docs.railway.app)
- [Cloudflare Pages 鏂囨。](https://developers.cloudflare.com/pages)
- [Next.js 閮ㄧ讲鏂囨。](https://nextjs.org/docs/deployment)