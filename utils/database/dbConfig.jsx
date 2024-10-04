//postgresql://waste_management_owner:3m4voLSZlGOw@ep-shy-art-a5w4c34s.us-east-2.aws.neon.tech/waste_management?sslmode=require

import {neon} from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {schema})