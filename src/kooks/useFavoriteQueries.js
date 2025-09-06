import { useQuery } from "@tanstack/react-query";
import {
  fetchFavoriteProducts,
  checkIfItemIsSaved,
} from "../services/favoriteApi";

export const useFavoriteQueries = () => {
  const useFavorites = () => {
    return useQuery({
      queryKey: ["favorites"],
      queryFn: fetchFavoriteProducts,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    });
  };

  const useFavoriteStatus = (productId) => {
    return useQuery({
      queryKey: ["favoriteStatus", productId],
      queryFn: () => checkIfItemIsSaved(productId),
      enabled: !!productId,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    });
  };

  return {
    useFavorites,
    useFavoriteStatus,
  };
};
