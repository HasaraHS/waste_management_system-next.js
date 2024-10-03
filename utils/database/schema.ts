import {integer, varchar, pgTable, serial, text, timestamp,
    jsonb, boolean} from 'drizzle-orm/pg-core'

//user table
export const Users = pgTable('users', {
    id : serial('id'). primaryKey(), //auto increment
    email : varchar('email', {length : 255}).notNull().unique(),
    name : varchar('name', {length : 255}).notNull(),
    createdAt : timestamp('created_at').defaultNow().notNull()
})

//report table
