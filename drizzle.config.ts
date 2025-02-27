import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://test_owner:npg_v3IAnWKoCrD1@ep-delicate-queen-a1str85n-pooler.ap-southeast-1.aws.neon.tech/test?sslmode=require" ,
  },
})
