# CC Scale 閮ㄧ讲鏋舵瀯(B2B 澶栬锤鐙珛绔?路 鈮?1000 SKU)

> 鏈枃妗ｅ熀浜庡伐绋嬬骇 Code Review 鍚庣殑浠ｇ爜鍩虹嚎(vercel.json / apps/api/railway.toml / .github/workflows/deploy.yml / Prisma 22 涓储寮?缁欏嚭鐢熶骇绾ч儴缃叉灦鏋勩€傜洰鏍?鍏ㄧ悆 B2B 涔板璁块棶銆佹捣澶栬鐩樿浆鍖栥€佽繍钀ユ垚鏈彲鎺?< $50/鏈堣捣姝?<$300/鏈堟垚闀块樁娈?銆?
---

## 1. 鏋舵瀯鎬昏

### 1.1 娴侀噺涓庣粍浠?
```mermaid
flowchart TB
  Visitor((娴峰涔板<br/>娆х編/涓笢/涓滃崡浜?)
  CF[Cloudflare<br/>DNS + CDN + WAF + Turnstile]
  VercelWeb[Vercel 路 Next.js<br/>www.zzscale.com<br/>fra1 region]
  VercelAdmin[Vercel 路 Next.js Admin<br/>admin.zzscale.com]
  Railway[Railway 路 NestJS API<br/>api.zzscale.com]
  Neon[(Neon Postgres<br/>鍒嗘敮 + Scale-to-Zero)]
  Upstash[(Upstash Redis<br/>闄愭祦 + Session)]
  R2[Cloudflare R2<br/>浜у搧鍥?/ 璇佷功 / 瑙嗛]
  Resend[Resend<br/>璇㈢洏浜嬪姟閭欢]
  Sentry[Sentry<br/>閿欒杩借釜]
  GA[GA4 + GSC<br/>SEO 鐩戞帶]

  Visitor -->|HTTPS| CF
  CF -->|/en /zh /products/*| VercelWeb
  CF -->|/admin| VercelAdmin
  VercelWeb -->|/api/* rewrite| Railway
  VercelAdmin -->|/api/* rewrite| Railway
  VercelWeb -->|/uploads/*| R2
  Railway --> Neon
  Railway --> Upstash
  Railway --> R2
  Railway --> Resend
  Railway --> Sentry
  VercelWeb --> GA
```

### 1.2 鍩熷悕瑙勫垝

| 鍩熷悕 | 鐢ㄩ€?| 閮ㄧ讲鐩爣 | 澶囨敞 |
|---|---|---|---|
| zzscale.com | 鏍瑰煙 | Cloudflare 301 鈫?www | 涓诲搧鐗?|
| www.zzscale.com | 钀ラ攢绔?| Vercel | Next.js + next-intl |
| admin.zzscale.com | 鍚庡彴 | Vercel 鐙珛椤圭洰 | Next.js admin 璺敱 |
| api.zzscale.com | 鍚庣 API | Railway | NestJS + Prisma |
| media.zzscale.com | 闈欐€佽祫婧?| Cloudflare R2 鍏紑妗?| 浜у搧鍥俱€丳DF 璇佷功 |
| mail.zzscale.com | MX | Resend / Cloudflare Email Routing | noreply@ |

---

## 2. 閫夊瀷鐞嗙敱

### 2.1 鍓嶇:Vercel(fra1 鍖哄煙)

- Next.js 鍘熺敓:ISR銆乬enerateStaticParams銆丒dge Runtime銆両mage Optimization 鍏ㄩ儴寮€绠卞嵆鐢?- 娆ф床杈圭紭鑺傜偣(fra1):鏍稿績瀹㈡埛缇ゅ湪寰峰浗銆佹剰澶у埄銆佹硶鍥姐€佽嫳鍥姐€佽嵎鍏?寤惰繜 < 50ms
- 闆惰繍缁?鏃犳湇鍔″櫒銆丳R Preview銆佽嚜甯?CDN銆丠TTPS 璇佷功鑷姩缁湡
- 浠锋牸:Hobby 鍏嶈垂,Pro $20/seat(鍚洟闃?Analytics);娴侀噺涓瓑(< 1TB/鏈?涓嶅姞璐?
> Vercel 涓嶉€傚悎闀块┗ API(Node 鍑芥暟鍐峰惎鍔?+ 鍗?region),鎵€浠?API 鎷嗗嚭銆?
### 2.2 API:Railway(Docker / Nixpacks)

- 甯搁┗杩涚▼:NestJS + Prisma + BullMQ worker,闀胯繛鎺ャ€佹枃浠舵祦涓婁紶
- 娆ф床鍖哄煙:Railway 閮ㄧ讲鍒?europe-west4(闃垮鏂壒涓?,涓?Vercel fra1 鍚屾床
- 闆堕厤缃?Dockerfile:宸叉湁 apps/api/railway.toml + Nixpacks 鑷姩 build
- 浠锋牸:Hobby $5/鏈?500 灏忔椂 + $0.000231/GB-min),鐢熶骇 ~$15-25/鏈?1GB RAM 甯搁┗)

### 2.3 鏁版嵁搴?Neon Serverless Postgres

- Scale-to-Zero:鏃犺闂椂 0 鎴愭湰,閫傚悎 B2B 璇㈢洏浣庨鍦烘櫙(鐧藉ぉ娆х編楂樺嘲,澶滈棿涓滃崡浜?鍑屾櫒绌洪棽)
- 鍒嗘敮鍔熻兘:main 鈫?preview 鈫?feature/*,PR 鑷姩鍒涘缓鍒嗘敮搴?- 涓?Prisma 瀹岀編鍏煎:DATABASE_URL 鐩磋繛,鏀寔杩炴帴姹??pgbouncer=true&connection_limit=1)
- 浠锋牸:Free 0.5GB(寮€鍙戠敤),Launch $19/鏈?10GB 瀛樺偍 + 191.9 灏忔椂 compute)

### 2.4 Redis:Upstash Redis

- 鍏ㄧ悆浣庡欢杩?HTTP / REST API,鏃?TCP 闀胯繛鎺?閫傚悎 Serverless)
- 鎸夎姹傝璐?$0.2/100K 璇锋眰,璧锋 < $1/鏈?- 鐢ㄩ€?NestJS Throttler 闄愭祦璁℃暟鍣ㄣ€丼ession銆丆ache(浜у搧鍒楄〃 5 鍒嗛挓缂撳瓨)

### 2.5 瀵硅薄瀛樺偍:Cloudflare R2

- 闆跺嚭鍙ｆ祦閲忚垂:media.zzscale.com 閫氳繃 Cloudflare CDN 杈圭紭杩斿洖,娌℃湁 AWS S3 閭ｇ $0.09/GB 鍑哄彛璐?- S3 鍏煎 API:Prisma 涔嬪,鍙敤 @aws-sdk/client-s3 鐩翠紶
- 鐢ㄩ€?浜у搧鍥?鍘熷浘 + 缂╃暐鍥?銆丳DF 璇佷功(CE / RoHS / ISO)銆佸鎴锋渚嬭棰?MP4

### 2.6 閭欢:Resend

- 寮€鍙戣€呭弸濂?React Email 妯℃澘銆丼PF/DKIM 鑷姩閰嶇疆
- 閫佽揪鐜?娆х編涓昏閭(Gmail / Outlook)閫佽揪鐜?> 99%
- 浠锋牸:Free 100 灏?澶?$20/鏈?50K 灏?婊¤冻 鈮?000 SKU B2B 璇㈢洏閲?棰勪及鏈堣鐩?200-500 灏?
- 閰嶅悎 apps/api/src/notifications/email.service.ts(宸蹭慨澶?HTML 娉ㄥ叆)

### 2.7 CAPTCHA:Cloudflare Turnstile(宸查泦鎴?

- 闅愮鍙嬪ソ:涓嶆敹闆嗙敤鎴锋寚绾?GDPR 鍚堣(娆ф床涔板蹇呯湅)
- 鍏嶈垂:涓嶉檺閲?- 宸叉帴鍏?apps/api/src/common/turnstile.service.ts + apps/web/components/Turnstile.tsx

### 2.8 鐩戞帶:Sentry + GA4 + Google Search Console

- Sentry:@sentry/nextjs 宸查厤缃?@sentry/nestjs 闇€鍔?- GA4:B2B 鍏抽敭鎸囨爣:璇㈢洏鎻愪氦鏁般€佺儹闂ㄤ骇鍝併€佸浗瀹跺垎甯冦€佽烦鍑虹巼
- GSC:https://www.zzscale.com/sitemap.xml 鎻愪氦,鐩戞帶鏀跺綍涓?hreflang 閿欒

---

## 3. 鈮?1000 SKU 浼樺寲绛栫暐

B2B 澶栬锤鐙珛绔欑殑鐗圭偣:SKU 鏁伴噺绋冲畾銆佹祦閲忛泦涓湪宸ヤ綔鏃ユ缇庢椂娈点€佸闂?鍛ㄦ湯浣庤礋杞姐€傛灦鏋勯拡瀵硅繖涓洸绾垮仛浜嗙缉瀹瑰埌 0 璁捐銆?
### 3.1 鏁版嵁灞?
- **Postgres**:Neon Launch plan,鏃犺繛鎺?5 鍒嗛挓鍚庢寕璧?鍐峰惎鍔?~500ms
- **Redis**:Upstash Pay-as-you-go,绌洪棽 0 鎴愭湰
- **闈欐€佽祫婧?*:鍏ㄩ儴璧?R2 + CDN,浜у搧鍥炬噿鍔犺浇(<img loading="lazy" decoding="async" />)
- **璇㈢洏璁板綍**:杩?90 澶?Neon,鍘嗗彶褰掓。 R2 Parquet(灏嗘潵)

### 3.2 璁＄畻灞?
- **Vercel ISR**:revalidate = 3600(浜у搧璇︽儏)銆乺evalidate = 600(棣栭〉),姣忓皬鏃舵渶澶?1 娆￠噸鏂版覆鏌?- **generateStaticParams**:鍙娓叉煋 top 100 娲昏穬浜у搧(宸插疄鐜?,鍏朵綑鎸夐渶 ISR
- **Railway 缂╁**:Hobby plan 1 instance $5/鏈堝父椹?鐢熶骇 plan 鐢?autoscale(1-3 instance)
- **鍥剧墖浼樺寲**:next/image 鑷姩 WebP/AVIF 杞崲 + 鍝嶅簲寮?srcset,Vercel 鍏ㄧ悆 CDN 杈圭紭缂撳瓨

### 3.3 浜у搧鏁版嵁瑙勬ā鍋囪

- 娲昏穬浜у搧:鈮?1000
- 绫诲埆:鈮?20
- 鍗曚骇鍝佸浘:骞冲潎 5 寮?鍏?~5000 寮?- 鍗曚骇鍝佽鎯呴〉澶у皬:200KB(鍚浘),CDN 缂撳瓨鍚?0KB 鍑虹珯
- 鏈堣鐩橀噺:200-500 灏?- 鏈堢嫭绔嬭瀹?5K-50K

### 3.4 鎬ц兘棰勭畻

- **LCP** < 2.0s(鐩爣 1.5s,浜у搧璇︽儏椤?
- **INP** < 150ms
- **CLS** < 0.05
- **TTFB** < 300ms(娆ф床杈圭紭)
- **JS bundle** < 180KB gzipped(棣栭〉)

---

## 4. 鐜涓庨厤缃?
### 4.1 鐜鍙橀噺(API 路 Railway)

```bash
NODE_ENV=production
PORT=8000
SITE_URL=https://www.zzscale.com
API_URL=https://api.zzscale.com

JWT_SECRET=<openssl rand -base64 48>
COOKIE_SECRET=<openssl rand -base64 48>
COOKIE_DOMAIN=.zzscale.com
COOKIE_SECURE=true

DATABASE_URL=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/zzscale?sslmode=require&pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/zzscale?sslmode=require

REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379

RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@mail.zzscale.com
ADMIN_EMAIL=sales@zzscale.com

TURNSTILE_SITE_KEY=0x4AAAA...
TURNSTILE_SECRET_KEY=0x4AAAA...

R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET=zzscale-media
R2_PUBLIC_URL=https://media.zzscale.com

UPLOAD_MAX_SIZE_MB=20
CORS_ORIGIN=https://www.zzscale.com,https://admin.zzscale.com
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 4.2 鐜鍙橀噺(Web 路 Vercel)

```bash
NEXT_PUBLIC_API_URL=https://api.zzscale.com
NEXT_PUBLIC_SITE_URL=https://www.zzscale.com
NEXT_PUBLIC_MEDIA_URL=https://media.zzscale.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
NEXT_PUBLIC_WHATSAPP_NUMBER=+8613800000000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 4.3 鐜鍙橀噺(Admin 路 Vercel)

```bash
NEXT_PUBLIC_API_URL=https://api.zzscale.com
NEXT_PUBLIC_SITE_URL=https://admin.zzscale.com
COOKIE_DOMAIN=.zzscale.com
```

---

## 5. 閮ㄧ讲姝ラ(2 鍛ㄨ惤鍦?

### 绗?1 鍛?鍩虹璁炬柦

| 澶?| 浠诲姟 | 璐ｄ换 |
|---|---|---|
| D1 | 娉ㄥ唽 Cloudflare / Vercel / Railway / Neon / Upstash / R2 / Resend / Sentry 璐﹀彿,缁戝畾 GitHub | DevOps |
| D1 | 鍩熷悕 zzscale.com 杞叆 Cloudflare,閰嶇疆 DNS 璁板綍(A / CNAME / MX) | DevOps |
| D2 | Neon 鍒涘缓 zzscale 椤圭洰,main + preview 鍒嗘敮 | DevOps |
| D2 | Upstash 鍒涘缓 Global Redis(娆ф床鍖哄煙) | DevOps |
| D3 | R2 鍒涘缓 zzscale-media 鍏紑妗?缁戝畾 media.zzscale.com 鑷畾涔夊煙 | DevOps |
| D3 | Resend 鍩熷悕楠岃瘉,閰嶇疆 SPF / DKIM / DMARC | DevOps |
| D4 | Cloudflare Turnstile 绔欑偣鍒涘缓,鑾峰緱 site key + secret | DevOps |
| D4 | Sentry 椤圭洰 cc-scale-web / cc-scale-api 鍒涘缓 | DevOps |
| D5 | 鏁版嵁搴撹縼绉?railway run npx prisma migrate deploy(22 涓储寮? | Backend |

### 绗?2 鍛?浠ｇ爜閮ㄧ讲

| 澶?| 浠诲姟 | 璐ｄ换 |
|---|---|---|
| D6 | API 涓?Railway:杩炴帴 GitHub main 鍒嗘敮,璁剧疆鐜鍙橀噺,鍋ュ悍妫€鏌?/api/health | Backend |
| D7 | Seed 绠＄悊鍛樿处鍙?ALLOW_SEED=1 railway run npx prisma db seed(鐢熶骇瀹堝崼宸插姞) | Backend |
| D7 | API 鐑熼浘娴嬭瘯:curl https://api.zzscale.com/api/health + /api/products?locale=en | Backend |
| D8 | Web 涓?Vercel:import GitHub repo,Root Directory = apps/web,region fra1 | Frontend |
| D8 | 缁戝畾鍩熷悕 www.zzscale.com(Vercel 鑷姩 TLS) | DevOps |
| D9 | Admin 涓?Vercel(鐙珛 project / 鍚屼竴 repo 涓嶅悓 root) | Frontend |
| D9 | vercel.json 楠岃瘉:API rewrite 鈫?api.zzscale.com,uploads 鈫?media.zzscale.com | DevOps |
| D10 | Cloudflare 閰嶇疆:SSL = Full Strict,Brotli,Always HTTPS,HSTS 1骞?| DevOps |
| D10 | 缂撳瓨瑙勫垯:/uploads/* Cache Standard,/_next/static/* Cache Immutable | DevOps |
| D11 | SEO 鎻愪氦:Google Search Console 鎻愪氦 sitemap, Bing Webmaster, Yandex | SEO |
| D11 | GSC 楠岃瘉:https://www.zzscale.com 鍩熼獙璇?DNS TXT) | SEO |
| D12 | E2E 娴嬭瘯:Playwright 璺?apps/web/e2e/ 鍏ㄥ(璇㈢洏鎻愪氦銆佺櫥褰曘€乄hatsApp 娴獥) | QA |
| D12 | 鎬ц兘楠岃瘉:PageSpeed Insights / WebPageTest 鍏ㄧ悆鑺傜偣,鐩爣 LCP < 2s | QA |
| D13 | 鐩戞帶鍛婅:Sentry 鍛婅 鈫?Slack,Neon / Upstash storage 鍛婅 鈫?Email | DevOps |
| D14 | 鐏板害鍙戝竷:Cloudflare Workers 5% 鈫?50% 鈫?100%(鍙€? | DevOps |

### 2 鍛ㄥ悗鐨勬棩甯歌繍钀?
- 浠ｇ爜鍚堝苟:main 鈫?Vercel 鑷姩 + Railway 鑷姩(GitHub Actions 浠呭仛杩佺Щ)
- 鏂板姛鑳?feature/* 鈫?Vercel Preview + Neon Branch
- 鍥炴粴:Vercel / Railway 鍚勮嚜 dashboard 涓€閿?rollback
- 鏁版嵁澶囦唤:Neon 鑷姩姣忔棩 backup(7 澶╀繚鐣?,WAL 褰掓。鍒?R2(鍙€?

---

## 6. CI/CD 娴佺▼

宸插瓨鍦ㄧ殑 .github/workflows/deploy.yml(鏈粨搴?:

```yaml
# Web 鈫?Vercel CLI(鑷姩)
# API 鈫?Railway Webhook(GitHub push 瑙﹀彂)
# DB 鈫?鎵嬪姩鎴?prisma migrate deploy via Railway shell
```

寤鸿鍔?3 涓?GitHub Actions:

1. **CI Lint/Test**(姣忔 PR):pnpm install / pnpm turbo run lint test / node scripts/check-bom.mjs
2. **CD Deploy**(merge to main):Web Vercel 鑷姩 / API Railway webhook
3. **DB Migration**(鎵嬪姩 dispatch):railway run npx prisma migrate deploy

---

## 7. 鎴愭湰浼扮畻(USD 路 鏈?

### 7.1 璧锋闃舵(< 1 涓?PV / 鏈?鈮?1000 SKU)

| 鏈嶅姟 | 璁″垝 | 鏈堣垂鐢?|
|---|---|---|
| Vercel Web | Hobby | $0 |
| Vercel Admin | Hobby | $0 |
| Railway API | Hobby 1 instance | $5 |
| Neon Postgres | Free(0.5GB) | $0 |
| Upstash Redis | Pay-as-you-go | $0(~ 100K req) |
| Cloudflare R2 | Free(10GB + 1K 涓囨璇? | $0 |
| Cloudflare CDN / DNS | Free | $0 |
| Resend | Free(100 灏?澶? | $0 |
| Cloudflare Turnstile | Free | $0 |
| Sentry | Developer(5K 浜嬩欢/鏈? | $0 |
| **灏忚** | | **鈮?$5 / 鏈?*(绾?Free) |

> **鐢熶骇鎺ㄨ崘棰勭畻 ~$36/鏈?*:Vercel Pro $20 + Railway $5 + Neon Launch $19 鐨勫畨鍏ㄤ綑閲忋€侳ree plan 鍦ㄧ敓浜т笉鎺ㄨ崘(鍐峰惎鍔ㄦ參銆丼LA 鏃犱繚璇?銆?
### 7.2 鎴愰暱闃舵(10 涓?PV / 鏈?

| 鏈嶅姟 | 璁″垝 | 鏈堣垂鐢?|
|---|---|---|
| Vercel Web | Pro | $20 |
| Vercel Admin | Pro | $20 |
| Railway API | Pro 1-2 instance | $25 |
| Neon Postgres | Launch(10GB) | $19 |
| Upstash Redis | Pay-as-you-go | $10 |
| Cloudflare R2 | Pay-as-you-go(100GB) | $3 |
| Cloudflare Pro | Pro(鏇寸粏 WAF 瑙勫垯) | $20 |
| Resend | Pro(50K 灏? | $20 |
| Sentry | Team(50K 浜嬩欢) | $26 |
| **灏忚** | | **鈮?$163 / 鏈?* |

### 7.3 瑙勬ā鍖栭樁娈?100 涓?PV / 鏈?

| 鏈嶅姟 | 璁″垝 | 鏈堣垂鐢?|
|---|---|---|
| Vercel Web + Admin | Enterprise | $250+ |
| Railway API | 3 instance autoscale | $75 |
| Neon Postgres | Scale(50GB) | $69 |
| Upstash Redis | Pro | $30 |
| Cloudflare R2 | 1TB | $15 |
| Cloudflare Pro | Pro | $20 |
| Resend | Scale | $90 |
| Sentry | Business | $80 |
| **灏忚** | | **鈮?$630 / 鏈?* |

---

## 8. 瀹夊叏娓呭崟(閮ㄧ讲鍚庡繀妫€)

- [x] JWT_SECRET 鈮?32 瀛楃涓斾笉鎻愪氦鍒?Git(apps/api/src/config/configuration.ts 宸插己鍒?
- [x] Cookie httpOnly + secure + sameSite=none(鐢熶骇)
- [x] Cloudflare Turnstile 鍚敤(璇㈢洏 / 鐧诲綍)
- [x] Rate limiting:Throttler 鐭獥 30 req/min銆丩ogin 5 req/min
- [x] Magic bytes 浜屾鏍￠獙(鍥剧墖 / PDF / 瑙嗛)
- [x] HTML escape 閭欢妯℃澘
- [x] HSTS / X-Frame-Options / X-Content-Type-Options(vercel.json headers)
- [ ] CSP(Content-Security-Policy)鈥?寰呭姞,瑙?Code Review Medium 椤?- [x] CORS 鐧藉悕鍗?鍙厑璁?zzscale.com 鍩?
- [x] Prisma 22 涓储寮?闃叉參鏌ヨ DoS)
- [x] 鏂囦欢璺緞閬嶅巻闃叉姢(/^[A-Za-z0-9._-]{1,200}$/)
- [x] Seed 鐢熶骇瀹堝崼(NODE_ENV=production && ALLOW_SEED!=1 鎶涢敊)

---

## 9. 鐏惧涓庣洃鎺?
### 9.1 澶囦唤

- **Neon**:鑷姩姣忔棩 backup(7 澶╀繚鐣?,鍙竴閿?PITR
- **R2**:寮€鍚?versioning,璇垹鍙仮澶?- **浠ｇ爜**:GitHub main + PR 姘镐箙淇濈暀
- **閰嶇疆**:1Password / Bitwarden 鍥㈤槦淇濋櫓搴撳瓨鎵€鏈夌幆澧冨彉閲?+ 鏈嶅姟鍑嵁

### 9.2 鐩戞帶鍛婅

| 鎸囨爣 | 闃堝€?| 閫氱煡娓犻亾 |
|---|---|---|
| API 5xx 閿欒鐜?| > 1% | Sentry 鈫?Slack #alerts |
| API p95 寤惰繜 | > 1s | Sentry 鈫?Slack |
| Neon 杩炴帴鏁?| > 80% | Neon dashboard 鈫?Email |
| Railway CPU | > 80% 鎸佺画 5min | Railway 鈫?Slack |
| Cloudflare 5xx | > 0.1% | Cloudflare 鈫?Email |
| Sentry 鏂?issue | 绔嬪嵆 | Slack #frontend |
| 璇㈢洏鏁?/ 澶?| < 5(涓嬭穼 50%) | Email sales@ |

### 9.3 Runbook(鍑洪棶棰樻椂)

- **API 5xx 椋欏崌**:Sentry 鐪?issue 鈫?Railway rollback 鈫?鏌?Neon 杩炴帴姹?- **Web 502**:Vercel status 鈫?check vercel.json rewrites 鈫?curl api.zzscale.com/api/health
- **璇㈢洏鏀朵笉鍒?*:Resend dashboard 鈫?妫€鏌?spam 鈫?妫€鏌?SPF/DKIM
- **鍥剧墖 404**:R2 dashboard 鈫?妫€鏌?bucket policy 鈫?妫€鏌?R2_PUBLIC_URL env

---

## 10. 涓婄嚎鍓嶅繀妫€娓呭崟(Go-Live Checklist)

### Critical(蹇呴』 0 闂)

- [ ] JWT_SECRET + COOKIE_SECRET 鍦?Railway 寮哄瘑鐮佺敓鎴愬苟淇濆瓨
- [ ] Neon prisma migrate deploy 鎴愬姛(22 涓储寮曞垱寤?
- [ ] R2 bucket 鍏叡璇绘潈闄愬紑鍚?media.zzscale.com 瑙ｆ瀽姝ｇ‘
- [ ] Cloudflare SSL = Full Strict(涓嶆槸 Flexible)
- [ ] DNS:www 鈫?Vercel,api 鈫?Railway,media 鈫?R2
- [ ] HTTPS 閲嶅畾鍚?HTTP 鈫?301 鈫?HTTPS
- [ ] HSTS header(Strict-Transport-Security: max-age=31536000; includeSubDomains; preload)

### High(蹇呴』瀹屾垚)

- [ ] Resend 鍩熷悕楠岃瘉 + SPF/DKIM/DMARC
- [ ] Turnstile site key + secret 鍦?web / api 鐜鍙橀噺閮芥湁
- [ ] Sentry DSN web + api 閮芥湁,Source Map 涓婁紶
- [ ] GA4 + GSC 楠岃瘉閫氳繃
- [ ] Sitemap(/sitemap.xml) 鍖呭惈鎵€鏈変骇鍝侀〉 + 鍗氬,鏃?404
- [ ] Hreflang 鏍囩姝ｇ‘(en/zh 浜掔浉鎸囧悜)
- [ ] robots.txt 涓嶉樆姝?/api/ 鎴?/_next/
- [ ] WhatsApp 娴獥 NEXT_PUBLIC_WHATSAPP_NUMBER 閰嶅ソ

### Medium(灏介噺瀹屾垚)

- [ ] Cloudflare Page Rules:/uploads/* Cache Everything
- [ ] prisma generate 鍦?CI 璺戦€?- [ ] E2E 娴嬭瘯閫氳繃(璇㈢洏 鈫?閭欢鍒拌揪)
- [ ] Lighthouse 鍒嗘暟:Performance > 90, SEO > 95, Accessibility > 95, Best Practices > 95
- [ ] Core Web Vitals 鍏ㄩ儴 Good(75th percentile)

### Low(鍙悗缁紭鍖?

- [ ] Cloudflare Workers 鐏板害鍙戝竷
- [ ] CSP header 鍔?nonce
- [ ] 澶氳瑷€鎵╁睍(寰?/ 娉?/ 瑗跨彮鐗?
- [ ] 璇㈢洏 AI 鏅鸿兘鍒嗗彂(鎸夊尯鍩?
- [ ] PWA / Offline 妯″紡

---

## 11. 椋庨櫓涓庡洖婊?
| 椋庨櫓 | 姒傜巼 | 褰卞搷 | 缂撹В |
|---|---|---|---|
| Neon 鍖哄煙鏁呴殰 | 鏋佷綆 | 鏁版嵁搴撲笉鍙敤 | Neon 鑷姩 PITR + Read Replica(Scale 璁″垝) |
| Railway instance 鎸傛帀 | 浣?| API 503 | Railway 鑷姩 restart + autoscale(1-3 instance) |
| Vercel 閮ㄧ讲澶辫触 | 浣?| Web 503 | Vercel 鑷姩 rollback 鍒颁笂涓€涓垚鍔熼儴缃?|
| Cloudflare 鏁呴殰 | 鏋佷綆 | CDN / DNS 涓嶅彲鐢?| 鍒囧埌 Cloudflare 澶囩敤璐﹀彿 / 涓存椂鐢?NS 鐩存寚 Vercel |
| 璇㈢洏閭欢涓?| 浣?| 瀹㈡埛娴佸け | Resend 澶辫触閲嶈瘯 + 澶囦唤閫氶亾 Slack Webhook |
| R2 妗跺垹闄?| 鏋佷綆 | 闈欐€佽祫婧愬叏鎸?| R2 versioning + Neon 瀛樺師濮嬫枃浠?hash |

---

## 12. 鏂囨。涓庨摼鎺?
- Cloudflare Dashboard:https://dash.cloudflare.com
- Vercel Dashboard:https://vercel.com/dashboard
- Railway Dashboard:https://railway.app/dashboard
- Neon Console:https://console.neon.tech
- Upstash Console:https://console.upstash.com
- Cloudflare R2:https://dash.cloudflare.com/?to=/:account/r2
- Resend Dashboard:https://resend.com/dashboard
- Sentry:https://sentry.io
- Google Search Console:https://search.google.com/search-console
- Bing Webmaster:https://www.bing.com/webmasters
- PageSpeed Insights:https://pagespeed.web.dev
- WebPageTest:https://www.webpagetest.org
- Schema Markup Validator:https://validator.schema.org
- Hreflang Tags Testing Tool:https://hreflang.ninja
- Cloudflare Turnstile:https://dash.cloudflare.com/?to=/:account/turnstile

---

> **鏈€鍚庢洿鏂?*:涓庝唬鐮佸熀绾垮悓姝?vercel.json / railway.toml / Prisma 22 绱㈠紩 / Turnstile 闆嗘垚)
> **缁存姢鑰?*:DevOps + Backend
> **瀹℃煡鍛ㄦ湡**:姣忔鏋舵瀯鍙樻洿鍚?1 鍛ㄥ唴 review
