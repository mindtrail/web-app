-- CreateEnum
CREATE TYPE "DatastoreVisibility" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "DatasourceStatus" AS ENUM ('unsynched', 'pending', 'running', 'synched', 'error', 'usage_limit_reached');

-- CreateEnum
CREATE TYPE "DatasourceType" AS ENUM ('web_page', 'web_site', 'text', 'file', 'google_drive_file', 'google_drive_folder', 'notion');

-- CreateEnum
CREATE TYPE "DatastoreType" AS ENUM ('qdrant');

-- CreateEnum
CREATE TYPE "ToolType" AS ENUM ('datastore');

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
CREATE TABLE "Account" (
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

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "picture" TEXT,
    "has_opt_in_email" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nb_agent_queries" INTEGER NOT NULL DEFAULT 0,
    "nb_datastore_queries" INTEGER NOT NULL DEFAULT 0,
    "nb_uploaded_bytes" INTEGER NOT NULL DEFAULT 0,
    "nb_data_processing_bytes" INTEGER NOT NULL DEFAULT 0,
    "nb_tokens" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Datastore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DatastoreType" NOT NULL,
    "visibility" "DatastoreVisibility" NOT NULL DEFAULT 'private',
    "config" JSONB,
    "owner_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Datastore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppDatasource" (
    "id" TEXT NOT NULL,
    "type" "DatasourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DatasourceStatus" NOT NULL DEFAULT 'unsynched',
    "config" JSONB,
    "datastore_id" TEXT,
    "owner_id" TEXT,
    "nb_chunks" INTEGER DEFAULT 0,
    "text_size" INTEGER DEFAULT 0,
    "hash" TEXT,
    "nb_synch" INTEGER DEFAULT 0,
    "last_synch" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppDatasource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT,
    "user_id" TEXT,
    "agent_id" TEXT,
    "channel" "ConversationChannel" NOT NULL DEFAULT 'dashboard',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "from" "MessageFrom" NOT NULL,
    "conversation_id" TEXT,
    "sources" JSONB,
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "type" "ToolType" NOT NULL,
    "agent_id" TEXT,
    "datastore_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL,
    "interval" "PriceInterval",
    "unit_amount" INTEGER,
    "interval_count" INTEGER,
    "trial_period_days" INTEGER,
    "type" "PriceType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" DEFAULT 'level_1',
    "priceId" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
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
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usage_user_id_key" ON "Usage"("user_id");

-- CreateIndex
CREATE INDEX "Conversation_visitor_id_idx" ON "Conversation" USING HASH ("visitor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_id_key" ON "Subscription"("user_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Datastore" ADD CONSTRAINT "Datastore_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppDatasource" ADD CONSTRAINT "AppDatasource_datastore_id_fkey" FOREIGN KEY ("datastore_id") REFERENCES "Datastore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppDatasource" ADD CONSTRAINT "AppDatasource_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_datastore_id_fkey" FOREIGN KEY ("datastore_id") REFERENCES "Datastore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
