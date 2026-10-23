import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllProducs, createProduct } from "../lib/api";

export const useProduct = () => {
  const result = useQuery({ queryKey: ["products"], queryFn: getAllProducs });
  return result;
};

export const useCreateProduct = () => {
  return useMutation({ mutationFn: createProduct });
};
