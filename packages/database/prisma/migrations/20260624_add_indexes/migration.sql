-- Add database indexes to fix slow queries on hot paths.
-- These are all additive (CREATE INDEX IF NOT EXISTS) so the migration
-- is safe to run on an existing database with data.

-- User
CREATE INDEX IF NOT EXISTS "User_role_isActive_idx" ON "User"("role", "isActive");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt" DESC);

-- ProductCategory
CREATE INDEX IF NOT EXISTS "ProductCategory_isActive_order_idx" ON "ProductCategory"("isActive", "order");

-- Product
CREATE INDEX IF NOT EXISTS "Product_isActive_isFeatured_order_idx" ON "Product"("isActive", "isFeatured", "order");
CREATE INDEX IF NOT EXISTS "Product_categoryId_isActive_order_idx" ON "Product"("categoryId", "isActive", "order");
CREATE INDEX IF NOT EXISTS "Product_priceMin_idx" ON "Product"("priceMin");
CREATE INDEX IF NOT EXISTS "Product_updatedAt_idx" ON "Product"("updatedAt" DESC);
CREATE INDEX IF NOT EXISTS "Product_moq_idx" ON "Product"("moq");

-- Inquiry
CREATE INDEX IF NOT EXISTS "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Inquiry_email_idx" ON "Inquiry"("email");
CREATE INDEX IF NOT EXISTS "Inquiry_assignedToId_status_idx" ON "Inquiry"("assignedToId", "status");
CREATE INDEX IF NOT EXISTS "Inquiry_trafficSource_createdAt_idx" ON "Inquiry"("trafficSource", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Inquiry_createdAt_idx" ON "Inquiry"("createdAt" DESC);

-- ActivityLog
CREATE INDEX IF NOT EXISTS "ActivityLog_inquiryId_createdAt_idx" ON "ActivityLog"("inquiryId", "createdAt" DESC);

-- UserSession
CREATE INDEX IF NOT EXISTS "UserSession_lastVisit_idx" ON "UserSession"("lastVisit" DESC);
CREATE INDEX IF NOT EXISTS "UserSession_trafficSource_lastVisit_idx" ON "UserSession"("trafficSource", "lastVisit" DESC);
CREATE INDEX IF NOT EXISTS "UserSession_utmSource_utmCampaign_lastVisit_idx" ON "UserSession"("utmSource", "utmCampaign", "lastVisit" DESC);
CREATE INDEX IF NOT EXISTS "UserSession_country_lastVisit_idx" ON "UserSession"("country", "lastVisit" DESC);

-- SessionEvent
CREATE INDEX IF NOT EXISTS "SessionEvent_sessionId_createdAt_idx" ON "SessionEvent"("sessionId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "SessionEvent_eventType_createdAt_idx" ON "SessionEvent"("eventType", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "SessionEvent_productId_idx" ON "SessionEvent"("productId");
CREATE INDEX IF NOT EXISTS "SessionEvent_createdAt_idx" ON "SessionEvent"("createdAt" DESC);