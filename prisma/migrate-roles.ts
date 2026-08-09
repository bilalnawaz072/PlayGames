import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRoles() {
  console.log('🔄 Migrating database UserRole enum values...');
  try {
    // Execute raw SQL to adjust the PostgreSQL enum type safely
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        -- Check if old enum values exist or if User table needs column type casting
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
          -- Drop default first
          ALTER TABLE "User" ALTER COLUMN role DROP DEFAULT;
          
          -- Alter column type using string casting
          ALTER TABLE "User" ALTER COLUMN role TYPE text USING role::text;

          -- Update any old enum string values in User table
          UPDATE "User" SET role = 'ADMIN' WHERE role IN ('SUPER_ADMIN', 'DEVELOPER');
          UPDATE "User" SET role = 'USER' WHERE role = 'PLAYER' OR role NOT IN ('ADMIN', 'USER');

          -- Drop old enum type if it exists
          DROP TYPE IF EXISTS "UserRole" CASCADE;
          
          -- Create new enum type
          CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

          -- Convert column back to new UserRole enum
          ALTER TABLE "User" ALTER COLUMN role TYPE "UserRole" USING role::"UserRole";

          -- Set default to USER
          ALTER TABLE "User" ALTER COLUMN role SET DEFAULT 'USER'::"UserRole";
        END IF;
      END $$;
    `);
    console.log('✅ Database UserRole enum successfully migrated to USER and ADMIN!');
  } catch (err: any) {
    console.error('Migration notice:', err?.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

migrateRoles();
