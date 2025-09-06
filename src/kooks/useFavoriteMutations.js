import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToFavorite,
  removeFromFavorite,
  checkIfItemIsSaved,
  clearAllFavorites,
  addToCartFromFavorites,
} from "../services/favoriteApi";

export const useFavoriteMutations = () => {
  const queryClient = useQueryClient();

  const addToFavoriteMutation = useMutation({
    mutationFn: addToFavorite,
    onSuccess: () => {
      // Invalidate and refetch favorite queries
      queryClient.invalidateQueries(["favorites"]);
      queryClient.invalidateQueries(["favorite"]);
    },
    onError: (error) => {
      console.error("خطا در افزودن به علاقه‌مندی‌ها:", error);
    },
  });

  const removeFromFavoriteMutation = useMutation({
    mutationFn: removeFromFavorite,
    onSuccess: () => {
      // Invalidate and refetch favorite queries
      queryClient.invalidateQueries(["favorites"]);
      queryClient.invalidateQueries(["favorite"]);
    },
    onError: (error) => {
      console.error("خطا در حذف از علاقه‌مندی‌ها:", error);
    },
  });

  const checkIfItemIsSavedMutation = useMutation({
    mutationFn: checkIfItemIsSaved,
    onError: (error) => {
      console.error("خطا در بررسی وضعیت مورد علاقه:", error);
    },
  });

  const clearAllFavoritesMutation = useMutation({
    mutationFn: clearAllFavorites,
    onSuccess: () => {
      // Invalidate and refetch favorite queries
      queryClient.invalidateQueries(["favorites"]);
      queryClient.invalidateQueries(["favorite"]);
      // Also invalidate cart queries since items might be moved there
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      console.error("خطا در پاک کردن همه موارد علاقه:", error);
    },
  });

  const addToCartFromFavoritesMutation = useMutation({
    mutationFn: addToCartFromFavorites,
    onSuccess: () => {
      // Invalidate and refetch both favorite and cart queries
      queryClient.invalidateQueries(["favorites"]);
      queryClient.invalidateQueries(["favorite"]);
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      console.error("خطا در افزودن به سبد خرید:", error);
    },
  });

  return {
    addToFavoriteMutation,
    removeFromFavoriteMutation,
    checkIfItemIsSavedMutation,
    clearAllFavoritesMutation,
    addToCartFromFavoritesMutation,
  };
};
