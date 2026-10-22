import api from "./axios";

// USER SYNC
export const syncUser = async (userData) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

// PRODUCT API
export const getAllProducs = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const myProducts = async () => {
  const { data } = await api.get("/products/my");
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async (id, ...productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// COMMENTS API
export const createComment = async (productId, content) => {
  const { data } = await api.post(`/comments/${productId}`, content);
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await api.post(`/comments/${commentId}`);
  return data;
};
