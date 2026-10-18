import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // text because we're using clerkId
  email: text("email").unique().notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  createAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("text").notNull(),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id") // foreign key untuk user
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id") // foreign key untuk product
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// Relations

// Users relations: seorang user dapat memiliki banyak comment dan product
// "many()" artinya satu user dapat memiliki banya catatan yang berhubungan
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products), // satu user => many products
  comments: many(comments), // satu user => many comments
}));

// Products relations: sebuat product dapat memiliki 1 user dam banyak comment
// "one()" artinya satu catatan yang berhubungan, 'many()' artinya banyak catatan yang berhubungan
export const productsRelations = relations(products, ({ many, one }) => ({
  comments: many(comments),
  // "fields" = foreign key pada table [products.userId]
  // "references" = primary key pada table [users.id]
  user: one(users, { fields: [products.userId], references: [users.id] }), // setu product => satu user
}));

// Comments relations = satu comments cuma bisa berasal dari 1 user dan 1 product
// "one()" artinya satu catatan yang berhubungan
export const commentsRelations = relations(comments, ({ one }) => ({
  // "fields" di isi foreign key, "refrences" di isi primary key
  // [comments.userId] untuk foreign key, [users.id] untuk primary key
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  // [comments.productId] untuk foreign key, [products.id] untuk primary key
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
}));

// type inference
export type Users = typeof users.$inferSelect;
export type NewUsers = typeof users.$inferInsert;

export type Products = typeof products.$inferSelect;
export type NewProducts = typeof products.$inferInsert;

export type Comments = typeof comments.$inferSelect;
export type NewComments = typeof comments.$inferInsert;
