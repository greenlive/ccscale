import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

/**
 * Generate a strong random password (~24 chars) for the seeded admin/editor.
 * Logged ONCE on stdout. Refuses to seed in production without ALLOW_SEED=1.
 */
function generatePassword(): string {
  return randomBytes(18).toString('base64url');
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== '1') {
    throw new Error(
      'Refusing to run seed in production. Set ALLOW_SEED=1 if you really need to re-seed (NOT recommended for password seeding).',
    );
  }

  console.log('Starting seed...');

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || generatePassword();
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`[seed] Generated admin password (write this down): ${adminPassword}`);
  }
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zzscale.com' },
    update: {},
    create: {
      email: 'admin@zzscale.com',
      password: await bcrypt.hash(adminPassword, 12),
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  const editorPassword = process.env.SEED_EDITOR_PASSWORD || generatePassword();
  if (!process.env.SEED_EDITOR_PASSWORD) {
    console.log(`[seed] Generated editor password (write this down): ${editorPassword}`);
  }
  const editor = await prisma.user.upsert({
    where: { email: 'editor@zzscale.com' },
    update: {},
    create: {
      email: 'editor@zzscale.com',
      password: await bcrypt.hash(editorPassword, 12),
      name: 'Editor User',
      role: 'EDITOR',
    },
  });
  console.log('Created editor user:', editor.email);
  // Create product categories
  const categories = [
    {
      nameEn: 'Body Scales',
      nameZh: '浣撻噸绉?,
      slug: 'body-scales',
      descriptionEn: 'High-precision digital body scales for home and commercial use',
      descriptionZh: '楂樼簿搴︽暟瀛椾綋閲嶇Г锛岄€傜敤浜庡搴拰鍟嗕笟鐢ㄩ€?,
      imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      order: 1,
    },
    {
      nameEn: 'Hanging Scales',
      nameZh: '鍚婄Г',
      slug: 'hanging-scales',
      descriptionEn: 'Heavy-duty hanging scales for industrial and commercial weighing',
      descriptionZh: '閲嶅瀷鍚婄Г锛岀敤浜庡伐涓氬拰鍟嗕笟绉伴噸',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      order: 2,
    },
    {
      nameEn: 'Kitchen Scales',
      nameZh: '鍘ㄦ埧绉?,
      slug: 'kitchen-scales',
      descriptionEn: 'Precision kitchen scales for accurate food measurement',
      descriptionZh: '绮惧瘑鍘ㄦ埧绉わ紝鐢ㄤ簬绮剧‘椋熺墿娴嬮噺',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      order: 3,
    },
    {
      nameEn: 'Baby Scales',
      nameZh: '濠村効绉?,
      slug: 'baby-scales',
      descriptionEn: 'Digital baby scales with high precision and safety',
      descriptionZh: '楂樼簿搴﹀畨鍏ㄦ暟瀛楀┐鍎跨Г',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
      order: 4,
    },
    {
      nameEn: 'Platform Scales',
      nameZh: '鍙扮Г',
      slug: 'platform-scales',
      descriptionEn: 'Industrial platform scales for heavy-duty weighing',
      descriptionZh: '宸ヤ笟鍙扮Г锛岀敤浜庨噸鍨嬬О閲?,
      imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800',
      order: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    console.log('Created/updated category:', cat.nameEn);
  }

  // Get categories for product creation
  const bodyScaleCat = await prisma.productCategory.findUnique({ where: { slug: 'body-scales' } });
  const hangingScaleCat = await prisma.productCategory.findUnique({ where: { slug: 'hanging-scales' } });
  const kitchenScaleCat = await prisma.productCategory.findUnique({ where: { slug: 'kitchen-scales' } });
  const babyScaleCat = await prisma.productCategory.findUnique({ where: { slug: 'baby-scales' } });

  // Create products
  const products = [
    {
      categoryId: bodyScaleCat!.id,
      sku: 'BS-200',
      nameEn: 'Digital Body Scale BS-200',
      nameZh: '鏁板瓧浣撻噸绉?BS-200',
      slug: 'digital-body-scale-bs-200',
      descriptionEn: 'High-precision digital body scale with advanced weighing technology. Features include step-on activation, auto-calibration, and large LCD display. Perfect for home and commercial use.',
      descriptionZh: '楂樼簿搴︽暟瀛椾綋閲嶇Г锛岄噰鐢ㄥ厛杩涚殑绉伴噸鎶€鏈€傚姛鑳藉寘鎷嵆韪╁嵆绉般€佽嚜鍔ㄦ牎鍑嗗拰澶ф恫鏅舵樉绀哄睆銆傞潪甯搁€傚悎瀹跺涵鍜屽晢涓氱敤閫斻€?,
      shortDescEn: 'Professional digital body scale for home and commercial use',
      shortDescZh: '閫傜敤浜庡搴拰鍟嗕笟鐢ㄩ€旂殑涓撲笟鏁板瓧浣撻噸绉?,
      mainImages: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      priceMin: 15,
      priceMax: 25,
      moq: 100,
      leadTime: '15-20 days',
      order: 1,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '鏈€澶хО閲?, valueEn: '180kg / 400lb', valueZh: '180鍏枻 / 400纾? },
        { keyEn: 'Division', keyZh: '鍒嗗害鍊?, valueEn: '100g', valueZh: '100鍏? },
        { keyEn: 'Display', keyZh: '鏄剧ず', valueEn: 'LCD, 3.5"', valueZh: '娑叉櫠鏄剧ず灞? 3.5鑻卞' },
        { keyEn: 'Power', keyZh: '鐢垫簮', valueEn: '2 x AAA batteries', valueZh: '2鑺侫AA鐢垫睜' },
        { keyEn: 'Dimensions', keyZh: '灏哄', valueEn: '300 x 300 x 25mm', valueZh: '300 x 300 x 25姣背' },
        { keyEn: 'Material', keyZh: '鏉愯川', valueEn: 'Tempered glass', valueZh: '閽㈠寲鐜荤拑' },
      ],
    },
    {
      categoryId: bodyScaleCat!.id,
      sku: 'BS-100',
      nameEn: 'Smart Body Scale BS-100',
      nameZh: '鏅鸿兘浣撹剛绉?BS-100',
      slug: 'smart-body-scale-bs-100',
      descriptionEn: 'Smart body scale with Bluetooth connectivity and body composition analysis. Syncs with mobile app to track weight, BMI, body fat, and more.',
      descriptionZh: '鏅鸿兘浣撹剛绉わ紝甯﹁摑鐗欒繛鎺ュ拰韬綋鎴愬垎鍒嗘瀽銆傚彲涓庢墜鏈哄簲鐢ㄥ悓姝ワ紝杩借釜浣撻噸銆丅MI銆佷綋鑴傜瓑鏁版嵁銆?,
      shortDescEn: 'Smart scale with body composition analysis',
      shortDescZh: '甯﹁韩浣撴垚鍒嗗垎鏋愮殑鏅鸿兘绉?,
      mainImages: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      priceMin: 25,
      priceMax: 45,
      moq: 50,
      leadTime: '20-25 days',
      order: 2,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '鏈€澶хО閲?, valueEn: '180kg / 400lb', valueZh: '180鍏枻 / 400纾? },
        { keyEn: 'Division', keyZh: '鍒嗗害鍊?, valueEn: '50g', valueZh: '50鍏? },
        { keyEn: 'Connectivity', keyZh: '杩炴帴', valueEn: 'Bluetooth 4.0', valueZh: '钃濈墮4.0' },
        { keyEn: 'App', keyZh: '搴旂敤', valueEn: 'iOS & Android', valueZh: 'iOS鍜屽畨鍗? },
      ],
    },
    {
      categoryId: hangingScaleCat!.id,
      sku: 'HS-500',
      nameEn: 'Industrial Hanging Scale HS-500',
      nameZh: '宸ヤ笟鍚婄Г HS-500',
      slug: 'industrial-hanging-scale-hs-500',
      descriptionEn: 'Heavy-duty industrial hanging scale designed for commercial and industrial applications. Perfect for weighing heavy loads in factories, warehouses, and markets.',
      descriptionZh: '閲嶅瀷宸ヤ笟鍚婄Г锛屼笓涓哄晢涓氬拰宸ヤ笟搴旂敤璁捐銆傞潪甯搁€傚悎鍦ㄥ伐鍘傘€佷粨搴撳拰甯傚満绉伴噺閲嶇墿銆?,
      shortDescEn: 'Heavy-duty hanging scale for industrial use',
      shortDescZh: '宸ヤ笟鐢ㄩ噸鍨嬪悐绉?,
      mainImages: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      priceMin: 45,
      priceMax: 85,
      moq: 50,
      leadTime: '20-25 days',
      order: 1,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '鏈€澶хО閲?, valueEn: '500kg', valueZh: '500鍏枻' },
        { keyEn: 'Division', keyZh: '鍒嗗害鍊?, valueEn: '200g', valueZh: '200鍏? },
        { keyEn: 'Display', keyZh: '鏄剧ず', valueEn: 'LED, 5 digit', valueZh: 'LED, 5浣嶆暟瀛? },
        { keyEn: 'Power', keyZh: '鐢垫簮', valueEn: 'Rechargeable battery', valueZh: '鍙厖鐢电數姹? },
      ],
    },
    {
      categoryId: kitchenScaleCat!.id,
      sku: 'KS-300',
      nameEn: 'Precision Kitchen Scale KS-300',
      nameZh: '绮惧瘑鍘ㄦ埧绉?KS-300',
      slug: 'precision-kitchen-scale-ks-300',
      descriptionEn: 'Professional precision kitchen scale for accurate food measurement. Perfect for cooking, baking, and portion control.',
      descriptionZh: '涓撲笟绮惧瘑鍘ㄦ埧绉わ紝鐢ㄤ簬绮剧‘椋熺墿娴嬮噺銆傞潪甯搁€傚悎鐑归オ銆佺儤鐒欏拰浠介噺鎺у埗銆?,
      shortDescEn: 'Accurate digital kitchen scale',
      shortDescZh: '绮剧‘鐨勬暟瀛楀帹鎴跨Г',
      mainImages: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      priceMin: 12,
      priceMax: 20,
      moq: 200,
      leadTime: '12-15 days',
      order: 1,
      isFeatured: false,
      specs: [
        { keyEn: 'Capacity', keyZh: '鏈€澶хО閲?, valueEn: '5kg / 11lb', valueZh: '5鍏枻 / 11纾? },
        { keyEn: 'Division', keyZh: '鍒嗗害鍊?, valueEn: '1g', valueZh: '1鍏? },
        { keyEn: 'Display', keyZh: '鏄剧ず', valueEn: 'LCD', valueZh: '娑叉櫠鏄剧ず灞? },
        { keyEn: 'Power', keyZh: '鐢垫簮', valueEn: '2 x AAA batteries', valueZh: '2鑺侫AA鐢垫睜' },
      ],
    },
    {
      categoryId: babyScaleCat!.id,
      sku: 'BB-100',
      nameEn: 'Digital Baby Scale BB-100',
      nameZh: '鏁板瓧濠村効绉?BB-100',
      slug: 'digital-baby-scale-bb-100',
      descriptionEn: 'Safe and accurate digital baby scale with high-precision sensor. Features include tare function, hold feature, and easy-to-clean tray.',
      descriptionZh: '瀹夊叏绮惧噯鐨勬暟瀛楀┐鍎跨Г锛岄厤澶囬珮绮惧害浼犳劅鍣ㄣ€傚姛鑳藉寘鎷幓鐨姛鑳姐€佷繚鎸佸姛鑳藉拰鏄撴竻娲佹墭鐩樸€?,
      shortDescEn: 'Safe and accurate baby scale',
      shortDescZh: '瀹夊叏绮惧噯鐨勫┐鍎跨Г',
      mainImages: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
      priceMin: 35,
      priceMax: 55,
      moq: 50,
      leadTime: '15-20 days',
      order: 1,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '鏈€澶хО閲?, valueEn: '20kg', valueZh: '20鍏枻' },
        { keyEn: 'Division', keyZh: '鍒嗗害鍊?, valueEn: '10g', valueZh: '10鍏? },
        { keyEn: 'Display', keyZh: '鏄剧ず', valueEn: 'LCD', valueZh: '娑叉櫠鏄剧ず灞? },
        { keyEn: 'Tray Size', keyZh: '鎵樼洏灏哄', valueEn: '560 x 300mm', valueZh: '560 x 300姣背' },
      ],
    },
  ];

  for (const prod of products) {
    const { specs, ...productData } = prod;
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: productData,
      create: productData,
    });

    // Create specs
    for (const spec of specs) {
      await prisma.productSpec.upsert({
        where: {
          id: (await prisma.productSpec.count()) + 1,
        },
        update: {},
        create: {
          ...spec,
          productId: product.id,
          order: specs.indexOf(spec),
        },
      });
    }
    console.log('Created/updated product:', product.nameEn);
  }

  // Create testimonials
  const testimonials = [
    {
      nameEn: 'John Smith',
      nameZh: '绾︾堪路鍙插瘑鏂?,
      companyEn: 'Global Imports Inc.',
      companyZh: '鍏ㄧ悆杩涘彛鍏徃',
      countryEn: 'United States',
      countryZh: '缇庡浗',
      contentEn: 'Excellent quality products and reliable service. We have been working together for 5 years and have always been satisfied with their products and delivery.',
      contentZh: '浜у搧璐ㄩ噺浼樼锛屾湇鍔″彲闈犮€傛垜浠凡缁忓悎浣滀簡5骞达紝瀵逛粬浠殑浜у搧鍜屾湇鍔′竴鐩村緢婊℃剰銆?,
      rating: 5,
      order: 1,
    },
    {
      nameEn: 'Maria Garcia',
      nameZh: '鐜涗附浜毬峰姞瑗夸簹',
      companyEn: 'EuroTrade Ltd.',
      companyZh: '娆ф床璐告槗鏈夐檺鍏徃',
      countryEn: 'Germany',
      countryZh: '寰峰浗',
      contentEn: 'Professional team, fast delivery, and competitive prices. The OEM customization service exceeded our expectations. Highly recommended!',
      contentZh: '涓撲笟鐨勫洟闃燂紝蹇€熺殑浜よ揣锛屾湁绔炰簤鍔涚殑浠锋牸銆侽EM瀹氬埗鏈嶅姟瓒呭嚭浜嗘垜浠殑鏈熸湜銆傚己鐑堟帹鑽愶紒',
      rating: 5,
      order: 2,
    },
    {
      nameEn: 'Ahmed Khan',
      nameZh: '鑹惧搱杩堝痉路姹?,
      companyEn: 'Middle East Trading',
      companyZh: '涓笢璐告槗鍏徃',
      countryEn: 'UAE',
      countryZh: '闃胯仈閰?,
      contentEn: 'Best scale manufacturer we have worked with. The quality is consistent and the customer support is excellent. They handle our bulk orders efficiently.',
      contentZh: '鎴戜滑鍚堜綔杩囩殑鏈€濂界殑绉ゅ埗閫犲晢銆傝川閲忕ǔ瀹氾紝瀹㈡埛鏈嶅姟浼樼銆備粬浠珮鏁堝鐞嗘垜浠殑鎵归噺璁㈠崟銆?,
      rating: 5,
      order: 3,
    },
    {
      nameEn: 'Yuki Tanaka',
      nameZh: '鐢颁腑浼樺笇',
      companyEn: 'Tokyo Trading Co.',
      companyZh: '涓滀含璐告槗鏍紡浼氱ぞ',
      countryEn: 'Japan',
      countryZh: '鏃ユ湰',
      contentEn: 'Very precise products and strict quality control. Their attention to detail matches our Japanese standards perfectly.',
      contentZh: '浜у搧闈炲父绮惧噯锛岃川閲忔帶鍒朵弗鏍笺€備粬浠缁嗚妭鐨勫叧娉ㄥ畬缇庣鍚堟垜浠棩鏈爣鍑嗐€?,
      rating: 5,
      order: 4,
    },
    {
      nameEn: 'David Brown',
      nameZh: '澶у崼路甯冩湕',
      companyEn: 'UK Retail Group',
      companyZh: '鑻卞浗闆跺敭闆嗗洟',
      countryEn: 'United Kingdom',
      countryZh: '鑻卞浗',
      contentEn: 'We have been ordering from CC Scale for 3 years. Their products sell well in our stores and customer returns are minimal.',
      contentZh: '鎴戜滑浠嶤C琛″櫒璁㈣揣宸叉湁3骞淬€備粬浠殑浜у搧鍦ㄦ垜浠殑搴楅噷閿€鍞緢濂斤紝瀹㈡埛閫€璐х巼寰堜綆銆?,
      rating: 5,
      order: 5,
    },
    {
      nameEn: 'Sarah Johnson',
      nameZh: '钀ㄦ媺路绾︾堪閫?,
      companyEn: 'Australian Wellness',
      companyZh: '婢冲ぇ鍒╀簹鍋ュ悍鍏徃',
      countryEn: 'Australia',
      countryZh: '婢冲ぇ鍒╀簹',
      contentEn: 'The smart body scales are a big hit in the Australian market. Great design and accurate measurements keep our customers coming back.',
      contentZh: '鏅鸿兘浣撹剛绉ゅ湪婢冲ぇ鍒╀簹甯傚満澶у彈娆㈣繋銆傚嚭鑹茬殑璁捐鍜岀簿鍑嗙殑娴嬮噺璁╂垜浠殑瀹㈡埛涓嶆柇鍥炶喘銆?,
      rating: 5,
      order: 6,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonials.indexOf(testimonial) + 1 },
      update: testimonial,
      create: testimonial,
    });
    console.log('Created/updated testimonial:', testimonial.nameEn);
  }

  // Create clients
  const clients = [
    { nameEn: 'Amazon', nameZh: '浜氶┈閫?, logoUrl: '/clients/amazon.png', website: 'https://amazon.com', order: 1 },
    { nameEn: 'Walmart', nameZh: '娌冨皵鐜?, logoUrl: '/clients/walmart.png', website: 'https://walmart.com', order: 2 },
    { nameEn: 'Carrefour', nameZh: '瀹朵箰绂?, logoUrl: '/clients/carrefour.png', website: 'https://carrefour.com', order: 3 },
    { nameEn: 'Tesco', nameZh: '涔愯喘', logoUrl: '/clients/tesco.png', website: 'https://tesco.com', order: 4 },
    { nameEn: 'Aldi', nameZh: '濂ヤ箰榻?, logoUrl: '/clients/aldi.png', website: 'https://aldi.com', order: 5 },
    { nameEn: 'Lidl', nameZh: '鍒╁痉', logoUrl: '/clients/lidl.png', website: 'https://lidl.com', order: 6 },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: clients.indexOf(client) + 1 },
      update: client,
      create: client,
    });
    console.log('Created/updated client:', client.nameEn);
  }

  // Create OEM steps
  const oemSteps = [
    {
      titleEn: 'Inquiry & Requirements',
      titleZh: '鍜ㄨ涓庨渶姹?,
      descEn: 'Submit your requirements including specifications, quantity, and customization needs.',
      descZh: '鎻愪氦鎮ㄧ殑闇€姹傦紝鍖呮嫭瑙勬牸銆佹暟閲忓拰瀹氬埗闇€姹傘€?,
      icon: 'MessageSquare',
      order: 1,
    },
    {
      titleEn: 'Quote & Approval',
      titleZh: '鎶ヤ环涓庣‘璁?,
      descEn: 'Receive detailed quotation including tooling costs, unit price, and lead time. Approve to proceed.',
      descZh: '鏀跺埌鍖呭惈妯″叿鎴愭湰銆佸崟浠峰拰浜ゆ湡鐨勮缁嗘姤浠枫€傜‘璁ゅ悗寮€濮嬬敓浜с€?,
      icon: 'FileCheck',
      order: 2,
    },
    {
      titleEn: 'Sample Development',
      titleZh: '鏍峰搧寮€鍙?,
      descEn: 'We develop samples according to your specifications for approval before mass production.',
      descZh: '鎴戜滑鏍规嵁鎮ㄧ殑瑙勬牸寮€鍙戞牱鍝侊紝鍦ㄦ壒閲忕敓浜у墠渚涙偍纭銆?,
      icon: 'Package',
      order: 3,
    },
    {
      titleEn: 'Mass Production',
      titleZh: '鎵归噺鐢熶骇',
      descEn: 'Once sample is approved, we proceed with mass production following strict QC standards.',
      descZh: '鏍峰搧纭鍚庯紝鎴戜滑鎸夌収涓ユ牸鐨勮川閲忔帶鍒舵爣鍑嗚繘琛屾壒閲忕敓浜с€?,
      icon: 'Factory',
      order: 4,
    },
    {
      titleEn: 'Quality Inspection',
      titleZh: '璐ㄩ噺妫€楠?,
      descEn: 'Rigorous inspection of all products before packaging and shipping.',
      descZh: '鎵€鏈変骇鍝佸湪鍖呰鍜屽彂璐у墠閮界粡杩囦弗鏍兼楠屻€?,
      icon: 'ShieldCheck',
      order: 5,
    },
    {
      titleEn: 'Shipping & Delivery',
      titleZh: '杩愯緭涓庝氦浠?,
      descEn: 'Safe packaging and efficient logistics to ensure timely delivery worldwide.',
      descZh: '瀹夊叏鍖呰鍜岄珮鏁堢墿娴侊紝纭繚鍏ㄧ悆鍙婃椂浜や粯銆?,
      icon: 'Truck',
      order: 6,
    },
  ];

  for (const step of oemSteps) {
    await prisma.oemStep.upsert({
      where: { id: step.order },
      update: step,
      create: step,
    });
    console.log('Created/updated OEM step:', step.titleEn);
  }

  // Create site settings
  // All keys use camelCase naming for front-end/back-end consistency
  const siteSettings = [
    // Company Info
    { key: 'companyNameEn', value: 'CC Scale Co., Ltd.' },
    { key: 'companyNameZh', value: 'CC琛″櫒鏈夐檺鍏徃' },
    { key: 'companyWechat', value: 'zzscale' },
    // SEO
    { key: 'seoTitleEn', value: 'CC Scale - Professional Weighing Solutions Manufacturer' },
    { key: 'seoTitleZh', value: 'CC琛″櫒 - 涓撲笟琛″櫒鍒堕€犲晢' },
    { key: 'seoDescriptionEn', value: 'Leading manufacturer of high-quality weighing scales. Body scales, hanging scales, kitchen scales, baby scales. OEM/ODM solutions for global B2B buyers.' },
    { key: 'seoDescriptionZh', value: '楂樺搧璐ㄨ　鍣ㄥ埗閫犲晢锛屾彁渚涗綋閲嶇Г銆佸悐绉ゃ€佸帹鎴跨Г銆佸┐鍎跨Г绛変骇鍝併€備负鍏ㄧ悆B2B涔板鎻愪緵OEM/ODM瑙ｅ喅鏂规銆? },
    // Contact Info (鐢ㄤ簬 Footer / Contact page)
    { key: 'contactEmail', value: 'sales@zzscale.com' },
    { key: 'contactPhone', value: '+86 123 4567 8900' },
    { key: 'contactWhatsApp', value: '+86 123 4567 8900' },
    { key: 'contactAddressEn', value: 'No. 88, Industrial Park, Yongkang, Zhejiang, China' },
    { key: 'contactAddressZh', value: '涓浗娴欐睙鐪佹案搴峰競宸ヤ笟鍥尯88鍙? },
    { key: 'contactWorkingHoursEn', value: 'Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)' },
    { key: 'contactWorkingHoursZh', value: '鍛ㄤ竴鑷冲懆浜? 9:00 - 18:00 (鍖椾含鏃堕棿)' },
    // Social Media Links (鐢ㄤ簬 Footer 绀句氦濯掍綋鍥炬爣)
    { key: 'socialFacebook', value: 'https://www.facebook.com/zzscale' },
    { key: 'socialLinkedIn', value: 'https://www.linkedin.com/company/zzscale' },
    { key: 'socialYouTube', value: 'https://www.youtube.com/@zzscale' },
    { key: 'socialInstagram', value: 'https://www.instagram.com/zzscale' },
    { key: 'socialTwitter', value: 'https://twitter.com/zzscale' },
    { key: 'socialAlibaba', value: 'https://zzscale.en.alibaba.com' },
    { key: 'socialMadeInChina', value: '' },
    // Social Media Content URLs (鐢ㄤ簬棣栭〉 SocialMediaShowcase 灞曠ず)
    { key: 'socialYoutubeContentUrl', value: 'https://www.youtube.com/@zzscale' },
    { key: 'socialFacebookContentUrl', value: 'https://www.facebook.com/zzscale' },
    { key: 'socialLinkedInContentUrl', value: 'https://www.linkedin.com/company/zzscale' },
    { key: 'socialInstagramContentUrl', value: 'https://www.instagram.com/zzscale' },
    { key: 'socialTikTokContentUrl', value: '' },
    // Legal
    { key: 'icpNumber', value: '娴橧CP澶嘪XXXXXXX鍙? },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('Created site settings');

  // Create page contents
  const pageContents = [
    {
      pageKey: 'about',
      titleEn: 'About Us',
      titleZh: '鍏充簬鎴戜滑',
      contentEn: JSON.stringify({
        stats: [
          { number: '20+', labelEn: 'Years Experience', labelZh: '骞寸粡楠? },
          { number: '100+', labelEn: 'Countries', labelZh: '涓浗瀹? },
          { number: '500K+', labelEn: 'Units/Year', labelZh: '骞翠骇閲? },
          { number: '50+', labelEn: 'R&D Team', labelZh: '鐮斿彂鍥㈤槦' },
        ],
        storyParagraphs: [
          'Founded in 2004, CC Scale has grown from a small workshop to a leading manufacturer of professional weighing equipment. Our commitment to quality and innovation has made us a trusted partner for businesses worldwide.',
          'With state-of-the-art production facilities and a dedicated R&D team, we continue to push the boundaries of weighing technology, delivering precise, reliable, and innovative solutions to our customers.',
        ],
        media: {
          storyImage: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600',
          videoCover: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200',
          videoUrl: '',
          videoTitleEn: 'CC Scale Factory Tour',
          videoTitleZh: 'CC Scale 宸ュ巶鍙傝',
          videoDurationEn: '4:30 min',
          videoDurationZh: '4鍒?0绉?,
          sectionTitleEn: 'Take a Tour of Our Factory',
          sectionTitleZh: '鍙傝鎴戜滑鐨勫伐鍘?,
          sectionSubtitleEn: 'See our state-of-the-art production facilities and quality control processes in action.',
          sectionSubtitleZh: '瑙傜湅鎴戜滑鍏堣繘鐨勭敓浜ц鏂藉拰璐ㄩ噺鎺у埗娴佺▼銆?,
          thumbnails: [
            { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', altEn: 'Production Line', altZh: '鐢熶骇绾? },
            { src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400', altEn: 'Quality Control', altZh: '璐ㄩ噺鎺у埗' },
            { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', altEn: 'R&D Lab', altZh: '鐮斿彂瀹為獙瀹? },
            { src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', altEn: 'Packaging & Shipping', altZh: '鍖呰涓庤繍杈? },
          ],
        },
      }),
      contentZh: JSON.stringify({
        milestones: [
          { year: '2004', titleEn: 'Founded', titleZh: '鍏徃鎴愮珛', descEn: 'Started with a small workshop', descZh: '浠庝竴涓皬杞﹂棿璧锋' },
          { year: '2010', titleEn: 'ISO Certification', titleZh: 'ISO璁よ瘉', descEn: 'Achieved ISO 9001 quality certification', descZh: '鑾峰緱ISO 9001璐ㄩ噺璁よ瘉' },
          { year: '2015', titleEn: 'Global Expansion', titleZh: '鍏ㄧ悆鎷撳睍', descEn: 'Exported to 50+ countries', descZh: '鍑哄彛鍒?0澶氫釜鍥藉' },
          { year: '2020', titleEn: 'Smart Factory', titleZh: '鏅鸿兘宸ュ巶', descEn: 'Automated production lines', descZh: '鑷姩鍖栫敓浜х嚎' },
        ],
        storyParagraphs: [
          'CC Scale鎴愮珛浜?004骞达紝浠庝竴涓皬杞﹂棿鍙戝睍鎴愪负涓撲笟琛″櫒璁惧鐨勯鍏堝埗閫犲晢銆傛垜浠璐ㄩ噺鍜屽垱鏂扮殑鎵胯浣挎垜浠垚涓哄叏鐞冧紒涓氬€煎緱淇¤禆鐨勫悎浣滀紮浼淬€?,
          '鍑€熷厛杩涚殑鐢熶骇璁炬柦鍜屼笓涓氱殑鐮斿彂鍥㈤槦锛屾垜浠笉鏂獊鐮磋　鍣ㄦ妧鏈殑杈圭晫锛屼负瀹㈡埛鎻愪緵绮剧‘銆佸彲闈犲拰鍒涙柊鐨勮В鍐虫柟妗堛€?,
        ],
      }),
      metaEn: 'Two decades of excellence in weighing solutions',
      metaZh: '浜屽崄骞磋　鍣ㄨВ鍐虫柟妗堢殑鍗撹秺缁忛獙',
    },
    {
      pageKey: 'guarantee',
      titleEn: 'Our Guarantees',
      titleZh: '淇濋殰涓績',
      contentEn: '',
      contentZh: '',
      metaEn: 'Quality assurance and delivery guarantees for B2B buyers',
      metaZh: '涓築2B涔板鎻愪緵璐ㄩ噺淇濊瘉鍜屼氦浠樹繚闅?,
    },
    {
      pageKey: 'contact',
      titleEn: 'Contact Us',
      titleZh: '鑱旂郴鎴戜滑',
      contentEn: JSON.stringify({
        heroSubtitle: {
          en: 'Get in touch with us for inquiries, quotes, or technical support',
          zh: '涓庢垜浠仈绯讳互鑾峰彇璇㈢洏銆佹姤浠锋垨鎶€鏈敮鎸?,
        },
        address: {
          en: 'No. 88, Industrial Park, Yongkang, Zhejiang, China',
          zh: '涓浗娴欐睙鐪佹案搴峰競宸ヤ笟鍥尯88鍙?,
        },
        email: {
          en: 'sales@zzscale.com; support@zzscale.com',
          zh: 'sales@zzscale.com; support@zzscale.com',
        },
        phone: {
          en: '+86 123 4567 8900; +86 123 4567 8901',
          zh: '+86 123 4567 8900; +86 123 4567 8901',
        },
        hours: {
          en: 'Monday - Friday: 9:00 - 18:00 (GMT+8)',
          zh: '鍛ㄤ竴鑷冲懆浜? 9:00 - 18:00 (鍖椾含鏃堕棿)',
        },
      }),
      contentZh: '',
      metaEn: 'Contact CC Scale for inquiries about weighing scales, OEM services, and custom solutions',
      metaZh: '鑱旂郴CC Scale锛屽挩璇㈣　鍣ㄤ骇鍝併€丱EM鏈嶅姟鍜屽畾鍒惰В鍐虫柟妗?,
    },
  ];

  for (const page of pageContents) {
    await prisma.pageContent.upsert({
      where: { pageKey: page.pageKey },
      update: page,
      create: page,
    });
  }
  console.log('Created page contents');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
