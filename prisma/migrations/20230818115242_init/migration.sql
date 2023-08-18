-- CreateEnum
CREATE TYPE "DataStoreVisibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "DataSrcStatus" AS ENUM ('unsynched', 'pending', 'running', 'synched', 'error', 'usage_limit_reached');

-- CreateEnum
CREATE TYPE "DataSrcType" AS ENUM ('web_page', 'web_site', 'text', 'file', 'google_drive_file', 'google_drive_folder', 'notion');

-- CreateEnum
CREATE TYPE "DataStoreType" AS ENUM ('qdrant');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('level_0', 'level_1', 'level_2', 'level_3');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('recurring');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid');

-- CreateEnum
CREATE TYPE "PriceInterval" AS ENUM ('day', 'month', 'week', 'year');

-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('raw', 'customer_support');

-- CreateEnum
CREATE TYPE "MessageFrom" AS ENUM ('agent', 'human');

-- CreateEnum
CREATE TYPE "ConversationChannel" AS ENUM ('dashboard', 'website', 'slack', 'crisp');

-- CreateEnum
CREATE TYPE "ModelName" AS ENUM ('gpt_3_5_turbo', 'gpt_3_5_turbo_16k', 'gpt_4', 'gpt_4_32k');

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationTokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "picture" TEXT,
    "hasOptInEmail" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nbAgentQueries" INTEGER NOT NULL DEFAULT 0,
    "nbDataStoreQueries" INTEGER NOT NULL DEFAULT 0,
    "nbUploadedBytes" INTEGER NOT NULL DEFAULT 0,
    "nbDataProcessingBytes" INTEGER NOT NULL DEFAULT 0,
    "nbModelTokens" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataStores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DataStoreType" NOT NULL,
    "visibility" "DataStoreVisibility" NOT NULL DEFAULT 'private',
    "config" JSONB,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataStores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSrcs" (
    "id" TEXT NOT NULL,
    "type" "DataSrcType" NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DataSrcStatus" NOT NULL DEFAULT 'unsynched',
    "config" JSONB,
    "dataStoreId" TEXT,
    "ownerId" TEXT,
    "nbChunks" INTEGER DEFAULT 0,
    "textSize" INTEGER DEFAULT 0,
    "hash" TEXT,
    "nbSynch" INTEGER DEFAULT 0,
    "lastSynch" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataSrcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversations" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT,
    "userId" TEXT,
    "agentId" TEXT,
    "channel" "ConversationChannel" NOT NULL DEFAULT 'dashboard',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "from" "MessageFrom" NOT NULL,
    "conversationId" TEXT,
    "sources" JSONB,
    "read" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prices" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL,
    "interval" "PriceInterval",
    "unitAmount" INTEGER,
    "interval_count" INTEGER,
    "trial_period_days" INTEGER,
    "type" "PriceType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" DEFAULT 'level_1',
    "priceId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "start_date" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "trial_start" TIMESTAMP(3),
    "cancel_at" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN,
    "canceled_at" TIMESTAMP(3),
    "metadata" JSONB,
    "coupon" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_provider_providerAccountId_key" ON "Accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_sessionToken_key" ON "Sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationTokens_token_key" ON "VerificationTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationTokens_identifier_token_key" ON "VerificationTokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usage_userId_key" ON "Usage"("userId");

-- CreateIndex
CREATE INDEX "Conversations_visitorId_idx" ON "Conversations" USING HASH ("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_userId_key" ON "Subscriptions"("userId");

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataStores" ADD CONSTRAINT "DataStores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSrcs" ADD CONSTRAINT "DataSrcs_dataStoreId_fkey" FOREIGN KEY ("dataStoreId") REFERENCES "DataStores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSrcs" ADD CONSTRAINT "DataSrcs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prices" ADD CONSTRAINT "Prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
