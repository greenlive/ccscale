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
    where: { email: 'admin@ccscale.com' },
    update: {},
    create: {
      email: 'admin@ccscale.com',
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
    where: { email: 'editor@ccscale.com' },
    update: {},
    create: {
      email: 'editor@ccscale.com',
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
      nameZh: '体重秤',
      slug: 'body-scales',
      descriptionEn: 'High-precision digital body scales for home and commercial use',
      descriptionZh: '高精度数字体重秤，适用于家庭和商业用途',
      imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      order: 1,
    },
    {
      nameEn: 'Hanging Scales',
      nameZh: '吊秤',
      slug: 'hanging-scales',
      descriptionEn: 'Heavy-duty hanging scales for industrial and commercial weighing',
      descriptionZh: '重型吊秤，用于工业和商业称重',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      order: 2,
    },
    {
      nameEn: 'Kitchen Scales',
      nameZh: '厨房秤',
      slug: 'kitchen-scales',
      descriptionEn: 'Precision kitchen scales for accurate food measurement',
      descriptionZh: '精密厨房秤，用于精确食物测量',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      order: 3,
    },
    {
      nameEn: 'Baby Scales',
      nameZh: '婴儿秤',
      slug: 'baby-scales',
      descriptionEn: 'Digital baby scales with high precision and safety',
      descriptionZh: '高精度安全数字婴儿秤',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
      order: 4,
    },
    {
      nameEn: 'Platform Scales',
      nameZh: '台秤',
      slug: 'platform-scales',
      descriptionEn: 'Industrial platform scales for heavy-duty weighing',
      descriptionZh: '工业台秤，用于重型称重',
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
      nameZh: '数字体重秤 BS-200',
      slug: 'digital-body-scale-bs-200',
      descriptionEn: 'High-precision digital body scale with advanced weighing technology. Features include step-on activation, auto-calibration, and large LCD display. Perfect for home and commercial use.',
      descriptionZh: '高精度数字体重秤，采用先进的称重技术。功能包括即踩即称、自动校准和大液晶显示屏。非常适合家庭和商业用途。',
      shortDescEn: 'Professional digital body scale for home and commercial use',
      shortDescZh: '适用于家庭和商业用途的专业数字体重秤',
      mainImages: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      priceMin: 15,
      priceMax: 25,
      moq: 100,
      leadTime: '15-20 days',
      order: 1,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅' },
        { keyEn: 'Division', keyZh: '分度值', valueEn: '100g', valueZh: '100克' },
        { keyEn: 'Display', keyZh: '显示', valueEn: 'LCD, 3.5"', valueZh: '液晶显示屏, 3.5英寸' },
        { keyEn: 'Power', keyZh: '电源', valueEn: '2 x AAA batteries', valueZh: '2节AAA电池' },
        { keyEn: 'Dimensions', keyZh: '尺寸', valueEn: '300 x 300 x 25mm', valueZh: '300 x 300 x 25毫米' },
        { keyEn: 'Material', keyZh: '材质', valueEn: 'Tempered glass', valueZh: '钢化玻璃' },
      ],
    },
    {
      categoryId: bodyScaleCat!.id,
      sku: 'BS-100',
      nameEn: 'Smart Body Scale BS-100',
      nameZh: '智能体脂秤 BS-100',
      slug: 'smart-body-scale-bs-100',
      descriptionEn: 'Smart body scale with Bluetooth connectivity and body composition analysis. Syncs with mobile app to track weight, BMI, body fat, and more.',
      descriptionZh: '智能体脂秤，带蓝牙连接和身体成分分析。可与手机应用同步，追踪体重、BMI、体脂等数据。',
      shortDescEn: 'Smart scale with body composition analysis',
      shortDescZh: '带身体成分分析的智能秤',
      mainImages: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      priceMin: 25,
      priceMax: 45,
      moq: 50,
      leadTime: '20-25 days',
      order: 2,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅' },
        { keyEn: 'Division', keyZh: '分度值', valueEn: '50g', valueZh: '50克' },
        { keyEn: 'Connectivity', keyZh: '连接', valueEn: 'Bluetooth 4.0', valueZh: '蓝牙4.0' },
        { keyEn: 'App', keyZh: '应用', valueEn: 'iOS & Android', valueZh: 'iOS和安卓' },
      ],
    },
    {
      categoryId: hangingScaleCat!.id,
      sku: 'HS-500',
      nameEn: 'Industrial Hanging Scale HS-500',
      nameZh: '工业吊秤 HS-500',
      slug: 'industrial-hanging-scale-hs-500',
      descriptionEn: 'Heavy-duty industrial hanging scale designed for commercial and industrial applications. Perfect for weighing heavy loads in factories, warehouses, and markets.',
      descriptionZh: '重型工业吊秤，专为商业和工业应用设计。非常适合在工厂、仓库和市场称量重物。',
      shortDescEn: 'Heavy-duty hanging scale for industrial use',
      shortDescZh: '工业用重型吊秤',
      mainImages: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      priceMin: 45,
      priceMax: 85,
      moq: 50,
      leadTime: '20-25 days',
      order: 1,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '500kg', valueZh: '500公斤' },
        { keyEn: 'Division', keyZh: '分度值', valueEn: '200g', valueZh: '200克' },
        { keyEn: 'Display', keyZh: '显示', valueEn: 'LED, 5 digit', valueZh: 'LED, 5位数字' },
        { keyEn: 'Power', keyZh: '电源', valueEn: 'Rechargeable battery', valueZh: '可充电电池' },
      ],
    },
    {
      categoryId: kitchenScaleCat!.id,
      sku: 'KS-300',
      nameEn: 'Precision Kitchen Scale KS-300',
      nameZh: '精密厨房秤 KS-300',
      slug: 'precision-kitchen-scale-ks-300',
      descriptionEn: 'Professional precision kitchen scale for accurate food measurement. Perfect for cooking, baking, and portion control.',
      descriptionZh: '专业精密厨房秤，用于精确食物测量。非常适合烹饪、烘焙和份量控制。',
      shortDescEn: 'Accurate digital kitchen scale',
      shortDescZh: '精确的数字厨房秤',
      mainImages: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      priceMin: 12,
      priceMax: 20,
      moq: 200,
      leadTime: '12-15 days',
      order: 1,
      isFeatured: false,
      specs: [
        { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '5kg / 11lb', valueZh: '5公斤 / 11磅' },
        { keyEn: 'Division', keyZh: '分度值', valueEn: '1g', valueZh: '1克' },
        { keyEn: 'Display', keyZh: '显示', valueEn: 'LCD', valueZh: '液晶显示屏' },
        { keyEn: 'Power', keyZh: '电源', valueEn: '2 x AAA batteries', valueZh: '2节AAA电池' },
      ],
    },
    {
      categoryId: babyScaleCat!.id,
      sku: 'BB-100',
      nameEn: 'Digital Baby Scale BB-100',
      nameZh: '数字婴儿秤 BB-100',
      slug: 'digital-baby-scale-bb-100',
      descriptionEn: 'Safe and accurate digital baby scale with high-precision sensor. Features include tare function, hold feature, and easy-to-clean tray.',
      descriptionZh: '安全精准的数字婴儿秤，配备高精度传感器。功能包括去皮功能、保持功能和易清洁托盘。',
      shortDescEn: 'Safe and accurate baby scale',
      shortDescZh: '安全精准的婴儿秤',
      mainImages: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800',
      priceMin: 35,
      priceMax: 55,
      moq: 50,
      leadTime: '15-20 days',
      order: 1,
      isFeatured: true,
      specs: [
        { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '20kg', valueZh: '20公斤' },
        { keyEn: 'Division', keyZh: '分度值', valueEn: '10g', valueZh: '10克' },
        { keyEn: 'Display', keyZh: '显示', valueEn: 'LCD', valueZh: '液晶显示屏' },
        { keyEn: 'Tray Size', keyZh: '托盘尺寸', valueEn: '560 x 300mm', valueZh: '560 x 300毫米' },
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
      nameZh: '约翰·史密斯',
      companyEn: 'Global Imports Inc.',
      companyZh: '全球进口公司',
      countryEn: 'United States',
      countryZh: '美国',
      contentEn: 'Excellent quality products and reliable service. We have been working together for 5 years and have always been satisfied with their products and delivery.',
      contentZh: '产品质量优秀，服务可靠。我们已经合作了5年，对他们的产品和服务一直很满意。',
      rating: 5,
      order: 1,
    },
    {
      nameEn: 'Maria Garcia',
      nameZh: '玛丽亚·加西亚',
      companyEn: 'EuroTrade Ltd.',
      companyZh: '欧洲贸易有限公司',
      countryEn: 'Germany',
      countryZh: '德国',
      contentEn: 'Professional team, fast delivery, and competitive prices. The OEM customization service exceeded our expectations. Highly recommended!',
      contentZh: '专业的团队，快速的交货，有竞争力的价格。OEM定制服务超出了我们的期望。强烈推荐！',
      rating: 5,
      order: 2,
    },
    {
      nameEn: 'Ahmed Khan',
      nameZh: '艾哈迈德·汗',
      companyEn: 'Middle East Trading',
      companyZh: '中东贸易公司',
      countryEn: 'UAE',
      countryZh: '阿联酋',
      contentEn: 'Best scale manufacturer we have worked with. The quality is consistent and the customer support is excellent. They handle our bulk orders efficiently.',
      contentZh: '我们合作过的最好的秤制造商。质量稳定，客户服务优秀。他们高效处理我们的批量订单。',
      rating: 5,
      order: 3,
    },
    {
      nameEn: 'Yuki Tanaka',
      nameZh: '田中优希',
      companyEn: 'Tokyo Trading Co.',
      companyZh: '东京贸易株式会社',
      countryEn: 'Japan',
      countryZh: '日本',
      contentEn: 'Very precise products and strict quality control. Their attention to detail matches our Japanese standards perfectly.',
      contentZh: '产品非常精准，质量控制严格。他们对细节的关注完美符合我们日本标准。',
      rating: 5,
      order: 4,
    },
    {
      nameEn: 'David Brown',
      nameZh: '大卫·布朗',
      companyEn: 'UK Retail Group',
      companyZh: '英国零售集团',
      countryEn: 'United Kingdom',
      countryZh: '英国',
      contentEn: 'We have been ordering from CC Scale for 3 years. Their products sell well in our stores and customer returns are minimal.',
      contentZh: '我们从CC衡器订货已有3年。他们的产品在我们的店里销售很好，客户退货率很低。',
      rating: 5,
      order: 5,
    },
    {
      nameEn: 'Sarah Johnson',
      nameZh: '萨拉·约翰逊',
      companyEn: 'Australian Wellness',
      companyZh: '澳大利亚健康公司',
      countryEn: 'Australia',
      countryZh: '澳大利亚',
      contentEn: 'The smart body scales are a big hit in the Australian market. Great design and accurate measurements keep our customers coming back.',
      contentZh: '智能体脂秤在澳大利亚市场大受欢迎。出色的设计和精准的测量让我们的客户不断回购。',
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
    { nameEn: 'Amazon', nameZh: '亚马逊', logoUrl: '/clients/amazon.png', website: 'https://amazon.com', order: 1 },
    { nameEn: 'Walmart', nameZh: '沃尔玛', logoUrl: '/clients/walmart.png', website: 'https://walmart.com', order: 2 },
    { nameEn: 'Carrefour', nameZh: '家乐福', logoUrl: '/clients/carrefour.png', website: 'https://carrefour.com', order: 3 },
    { nameEn: 'Tesco', nameZh: '乐购', logoUrl: '/clients/tesco.png', website: 'https://tesco.com', order: 4 },
    { nameEn: 'Aldi', nameZh: '奥乐齐', logoUrl: '/clients/aldi.png', website: 'https://aldi.com', order: 5 },
    { nameEn: 'Lidl', nameZh: '利德', logoUrl: '/clients/lidl.png', website: 'https://lidl.com', order: 6 },
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
      titleZh: '咨询与需求',
      descEn: 'Submit your requirements including specifications, quantity, and customization needs.',
      descZh: '提交您的需求，包括规格、数量和定制需求。',
      icon: 'MessageSquare',
      order: 1,
    },
    {
      titleEn: 'Quote & Approval',
      titleZh: '报价与确认',
      descEn: 'Receive detailed quotation including tooling costs, unit price, and lead time. Approve to proceed.',
      descZh: '收到包含模具成本、单价和交期的详细报价。确认后开始生产。',
      icon: 'FileCheck',
      order: 2,
    },
    {
      titleEn: 'Sample Development',
      titleZh: '样品开发',
      descEn: 'We develop samples according to your specifications for approval before mass production.',
      descZh: '我们根据您的规格开发样品，在批量生产前供您确认。',
      icon: 'Package',
      order: 3,
    },
    {
      titleEn: 'Mass Production',
      titleZh: '批量生产',
      descEn: 'Once sample is approved, we proceed with mass production following strict QC standards.',
      descZh: '样品确认后，我们按照严格的质量控制标准进行批量生产。',
      icon: 'Factory',
      order: 4,
    },
    {
      titleEn: 'Quality Inspection',
      titleZh: '质量检验',
      descEn: 'Rigorous inspection of all products before packaging and shipping.',
      descZh: '所有产品在包装和发货前都经过严格检验。',
      icon: 'ShieldCheck',
      order: 5,
    },
    {
      titleEn: 'Shipping & Delivery',
      titleZh: '运输与交付',
      descEn: 'Safe packaging and efficient logistics to ensure timely delivery worldwide.',
      descZh: '安全包装和高效物流，确保全球及时交付。',
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
    { key: 'companyNameZh', value: 'CC衡器有限公司' },
    { key: 'companyWechat', value: 'ccscale' },
    // SEO
    { key: 'seoTitleEn', value: 'CC Scale - Professional Weighing Solutions Manufacturer' },
    { key: 'seoTitleZh', value: 'CC衡器 - 专业衡器制造商' },
    { key: 'seoDescriptionEn', value: 'Leading manufacturer of high-quality weighing scales. Body scales, hanging scales, kitchen scales, baby scales. OEM/ODM solutions for global B2B buyers.' },
    { key: 'seoDescriptionZh', value: '高品质衡器制造商，提供体重秤、吊秤、厨房秤、婴儿秤等产品。为全球B2B买家提供OEM/ODM解决方案。' },
    // Contact Info (用于 Footer / Contact page)
    { key: 'contactEmail', value: 'sales@ccscale.com' },
    { key: 'contactPhone', value: '+86 123 4567 8900' },
    { key: 'contactWhatsApp', value: '+86 123 4567 8900' },
    { key: 'contactAddressEn', value: 'No. 88, Industrial Park, Yongkang, Zhejiang, China' },
    { key: 'contactAddressZh', value: '中国浙江省永康市工业园区88号' },
    { key: 'contactWorkingHoursEn', value: 'Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)' },
    { key: 'contactWorkingHoursZh', value: '周一至周五: 9:00 - 18:00 (北京时间)' },
    // Social Media Links (用于 Footer 社交媒体图标)
    { key: 'socialFacebook', value: 'https://www.facebook.com/ccscale' },
    { key: 'socialLinkedIn', value: 'https://www.linkedin.com/company/ccscale' },
    { key: 'socialYouTube', value: 'https://www.youtube.com/@ccscale' },
    { key: 'socialInstagram', value: 'https://www.instagram.com/ccscale' },
    { key: 'socialTwitter', value: 'https://twitter.com/ccscale' },
    { key: 'socialAlibaba', value: 'https://ccscale.en.alibaba.com' },
    { key: 'socialMadeInChina', value: '' },
    // Social Media Content URLs (用于首页 SocialMediaShowcase 展示)
    { key: 'socialYoutubeContentUrl', value: 'https://www.youtube.com/@ccscale' },
    { key: 'socialFacebookContentUrl', value: 'https://www.facebook.com/ccscale' },
    { key: 'socialLinkedInContentUrl', value: 'https://www.linkedin.com/company/ccscale' },
    { key: 'socialInstagramContentUrl', value: 'https://www.instagram.com/ccscale' },
    { key: 'socialTikTokContentUrl', value: '' },
    // Legal
    { key: 'icpNumber', value: '浙ICP备XXXXXXXX号' },
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
      titleZh: '关于我们',
      contentEn: JSON.stringify({
        stats: [
          { number: '20+', labelEn: 'Years Experience', labelZh: '年经验' },
          { number: '100+', labelEn: 'Countries', labelZh: '个国家' },
          { number: '500K+', labelEn: 'Units/Year', labelZh: '年产量' },
          { number: '50+', labelEn: 'R&D Team', labelZh: '研发团队' },
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
          videoTitleZh: 'CC Scale 工厂参观',
          videoDurationEn: '4:30 min',
          videoDurationZh: '4分30秒',
          sectionTitleEn: 'Take a Tour of Our Factory',
          sectionTitleZh: '参观我们的工厂',
          sectionSubtitleEn: 'See our state-of-the-art production facilities and quality control processes in action.',
          sectionSubtitleZh: '观看我们先进的生产设施和质量控制流程。',
          thumbnails: [
            { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', altEn: 'Production Line', altZh: '生产线' },
            { src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400', altEn: 'Quality Control', altZh: '质量控制' },
            { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', altEn: 'R&D Lab', altZh: '研发实验室' },
            { src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', altEn: 'Packaging & Shipping', altZh: '包装与运输' },
          ],
        },
      }),
      contentZh: JSON.stringify({
        milestones: [
          { year: '2004', titleEn: 'Founded', titleZh: '公司成立', descEn: 'Started with a small workshop', descZh: '从一个小车间起步' },
          { year: '2010', titleEn: 'ISO Certification', titleZh: 'ISO认证', descEn: 'Achieved ISO 9001 quality certification', descZh: '获得ISO 9001质量认证' },
          { year: '2015', titleEn: 'Global Expansion', titleZh: '全球拓展', descEn: 'Exported to 50+ countries', descZh: '出口到50多个国家' },
          { year: '2020', titleEn: 'Smart Factory', titleZh: '智能工厂', descEn: 'Automated production lines', descZh: '自动化生产线' },
        ],
        storyParagraphs: [
          'CC Scale成立于2004年，从一个小车间发展成为专业衡器设备的领先制造商。我们对质量和创新的承诺使我们成为全球企业值得信赖的合作伙伴。',
          '凭借先进的生产设施和专业的研发团队，我们不断突破衡器技术的边界，为客户提供精确、可靠和创新的解决方案。',
        ],
      }),
      metaEn: 'Two decades of excellence in weighing solutions',
      metaZh: '二十年衡器解决方案的卓越经验',
    },
    {
      pageKey: 'guarantee',
      titleEn: 'Our Guarantees',
      titleZh: '保障中心',
      contentEn: '',
      contentZh: '',
      metaEn: 'Quality assurance and delivery guarantees for B2B buyers',
      metaZh: '为B2B买家提供质量保证和交付保障',
    },
    {
      pageKey: 'contact',
      titleEn: 'Contact Us',
      titleZh: '联系我们',
      contentEn: JSON.stringify({
        heroSubtitle: {
          en: 'Get in touch with us for inquiries, quotes, or technical support',
          zh: '与我们联系以获取询盘、报价或技术支持',
        },
        address: {
          en: 'No. 88, Industrial Park, Yongkang, Zhejiang, China',
          zh: '中国浙江省永康市工业园区88号',
        },
        email: {
          en: 'sales@ccscale.com; support@ccscale.com',
          zh: 'sales@ccscale.com; support@ccscale.com',
        },
        phone: {
          en: '+86 123 4567 8900; +86 123 4567 8901',
          zh: '+86 123 4567 8900; +86 123 4567 8901',
        },
        hours: {
          en: 'Monday - Friday: 9:00 - 18:00 (GMT+8)',
          zh: '周一至周五: 9:00 - 18:00 (北京时间)',
        },
      }),
      contentZh: '',
      metaEn: 'Contact CC Scale for inquiries about weighing scales, OEM services, and custom solutions',
      metaZh: '联系CC Scale，咨询衡器产品、OEM服务和定制解决方案',
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
