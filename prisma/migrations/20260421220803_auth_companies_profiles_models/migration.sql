-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "companies";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "profiles";

-- CreateEnum
CREATE TYPE "auth"."user_role" AS ENUM ('CANDIDATE', 'EMPLOYER', 'ADMIN');

-- CreateTable
CREATE TABLE "profiles"."candidate_profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "middle_name" VARCHAR(100),
    "birthday" TIMESTAMPTZ,
    "phone" VARCHAR(20),
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(20),
    "avatar" VARCHAR(500),
    "bio" TEXT,
    "location" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "candidate_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies"."companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "inn" VARCHAR(20),
    "company_type_id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies"."company_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "company_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."hr_roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "hr_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."role_contexts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_role" "auth"."user_role" NOT NULL,
    "company_id" UUID,
    "hr_role_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleContextId" UUID NOT NULL,
    "refreshToken" VARCHAR(500) NOT NULL,
    "deviceId" VARCHAR(255) NOT NULL,
    "deviceName" VARCHAR(255),
    "userAgent" TEXT,
    "ipAddress" VARCHAR(45),
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activationLink" VARCHAR(255),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_profiles_userId_key" ON "profiles"."candidate_profiles"("userId");

-- CreateIndex
CREATE INDEX "candidate_profiles_userId_idx" ON "profiles"."candidate_profiles"("userId");

-- CreateIndex
CREATE INDEX "companies_created_by_idx" ON "companies"."companies"("created_by");

-- CreateIndex
CREATE INDEX "companies_owner_id_idx" ON "companies"."companies"("owner_id");

-- CreateIndex
CREATE INDEX "companies_inn_idx" ON "companies"."companies"("inn");

-- CreateIndex
CREATE INDEX "companies_company_type_id_idx" ON "companies"."companies"("company_type_id");

-- CreateIndex
CREATE INDEX "companies_updated_by_idx" ON "companies"."companies"("updated_by");

-- CreateIndex
CREATE UNIQUE INDEX "company_types_name_key" ON "companies"."company_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company_types_slug_key" ON "companies"."company_types"("slug");

-- CreateIndex
CREATE INDEX "company_types_slug_idx" ON "companies"."company_types"("slug");

-- CreateIndex
CREATE INDEX "company_types_name_idx" ON "companies"."company_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_roles_name_key" ON "auth"."hr_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_roles_slug_key" ON "auth"."hr_roles"("slug");

-- CreateIndex
CREATE INDEX "hr_roles_name_idx" ON "auth"."hr_roles"("name");

-- CreateIndex
CREATE INDEX "hr_roles_slug_idx" ON "auth"."hr_roles"("slug");

-- CreateIndex
CREATE INDEX "role_contexts_user_id_idx" ON "auth"."role_contexts"("user_id");

-- CreateIndex
CREATE INDEX "role_contexts_company_id_idx" ON "auth"."role_contexts"("company_id");

-- CreateIndex
CREATE INDEX "role_contexts_hr_role_id_idx" ON "auth"."role_contexts"("hr_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refreshToken_key" ON "auth"."tokens"("refreshToken");

-- CreateIndex
CREATE INDEX "tokens_userId_idx" ON "auth"."tokens"("userId");

-- CreateIndex
CREATE INDEX "tokens_roleContextId_idx" ON "auth"."tokens"("roleContextId");

-- CreateIndex
CREATE INDEX "tokens_deviceId_idx" ON "auth"."tokens"("deviceId");

-- CreateIndex
CREATE INDEX "tokens_expiresAt_idx" ON "auth"."tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "tokens_userId_roleContextId_deviceId_idx" ON "auth"."tokens"("userId", "roleContextId", "deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_activationLink_key" ON "auth"."users"("activationLink");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "auth"."users"("email");

-- CreateIndex
CREATE INDEX "users_createdBy_idx" ON "auth"."users"("createdBy");

-- CreateIndex
CREATE INDEX "users_updatedBy_idx" ON "auth"."users"("updatedBy");

-- AddForeignKey
ALTER TABLE "profiles"."candidate_profiles" ADD CONSTRAINT "candidate_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies"."companies" ADD CONSTRAINT "companies_company_type_id_fkey" FOREIGN KEY ("company_type_id") REFERENCES "companies"."company_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies"."companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies"."companies" ADD CONSTRAINT "companies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies"."companies" ADD CONSTRAINT "companies_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."role_contexts" ADD CONSTRAINT "role_contexts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."role_contexts" ADD CONSTRAINT "role_contexts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."role_contexts" ADD CONSTRAINT "role_contexts_hr_role_id_fkey" FOREIGN KEY ("hr_role_id") REFERENCES "auth"."hr_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."tokens" ADD CONSTRAINT "tokens_roleContextId_fkey" FOREIGN KEY ("roleContextId") REFERENCES "auth"."role_contexts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
