import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type NewUsers, // untuk import type best practicenya pakai "type"
  type NewProducts, // tapi ini optional
  type NewComments,
} from "./schema";

// USERS QUERIES
export const createUser = async (data: NewUsers) => {
  const [user] = await db.insert(users).values(data).returning();

  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<NewUsers>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }

  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  return user;
};

// upsert => create or update
export const upsertUser = async (data: NewUsers) => {
  //  ### kode yang pertama kali dibuat ###
  //   const existingUser = await getUserById(data.id);
  //   if (existingUser) return updateUser(data.id, data);

  //   return createUser(data);

  // ### code rabit suqestions ###
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({ target: users.id, set: data })
    .returning();
  return user;
};

// PRODUCTS QUERIES
export const createProduct = async (data: NewProducts) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async () => {
  // {with: {user: true}} => Meminta Drizzle mengambil data relasi user untuk setiap produk.
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createAt)], // desc => mengurutkan list dari yang terbaru dulu
    // tanda [] diperlukan karena Drizzle orm "orderBy" mangharapkan array, bahkan dari single value
  });
  // ex tanpa "with":{
  //     id: 1,
  //     name: "Laptop",
  //     userId: 1
  //   },

  // ex dengan "with": {
  //     id: 1,
  //     name: "Laptop",
  //     userId: 1,
  //     user: { ### ada penambahan key user yang berisi data user ###
  //       id: 1,
  //       name: "Andi"
  //     }
  //   }
};

export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createAt)],
      },
    },
  });
};

export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProducts>) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();

  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// COMMENT QUERIES
export const createComment = async (data: NewComments) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};
