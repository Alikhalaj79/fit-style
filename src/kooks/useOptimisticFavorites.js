import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  addToFavorite,
  removeFromFavorite,
  fetchFavoriteProducts,
} from "../services/favoriteApi";

export const useOptimisticFavorites = () => {
  const queryClient = useQueryClient();

  // Get favorites data from query
  const {
    data: favoritesData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favorite"],
    queryFn: fetchFavoriteProducts,
    staleTime: 1000 * 60, // 1 minute
  });

  // Manual optimistic state management
  const [optimisticFavorites, setOptimisticFavorites] = useState(favoritesData);

  // Update optimistic state when server data changes
  useEffect(() => {
    if (favoritesData && favoritesData.length >= 0) {
      setOptimisticFavorites(favoritesData);
    }
  }, [favoritesData]);

  // Manual optimistic update function
  const addOptimisticFavorite = ({ action, productId }) => {
    setOptimisticFavorites((currentState) => {
      switch (action) {
        case "add":
          // Check if product is already in favorites
          const isAlreadyFavorite = currentState.some(
            (item) =>
              item.productId?._id === productId || item.productId === productId
          );

          if (isAlreadyFavorite) {
            return currentState; // Don't add if already exists
          }

          // Add optimistic favorite item
          return [
            ...currentState,
            {
              _id: `temp-${productId}-${Date.now()}`, // Temporary ID
              productId: { _id: productId },
              savedAt: new Date().toISOString(),
            },
          ];

        case "remove":
          // Remove from favorites
          return currentState.filter(
            (item) =>
              item.productId?._id !== productId && item.productId !== productId
          );

        default:
          return currentState;
      }
    });
  };

  // Add to favorite mutation with optimistic updates
  const addToFavoriteMutation = useMutation({
    mutationFn: addToFavorite,
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["favorite"] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(["favorite"]);

      // Optimistically update the cache
      addOptimisticFavorite({ action: "add", productId });

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (err, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorite"], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  // Remove from favorite mutation with optimistic updates
  const removeFromFavoriteMutation = useMutation({
    mutationFn: removeFromFavorite,
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["favorite"] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(["favorite"]);

      // Optimistically update the cache
      addOptimisticFavorite({ action: "remove", productId });

      // Return a context object with the snapshotted value
      return { previousFavorites };
    },
    onError: (err, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorite"], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
    },
  });

  // Helper function to check if product is favorite
  const isProductFavorite = (productId) => {
    return optimisticFavorites.some(
      (item) =>
        item.productId?._id === productId || item.productId === productId
    );
  };

  return {
    optimisticFavorites,
    addToFavoriteMutation,
    removeFromFavoriteMutation,
    isProductFavorite,
    favoritesData,
    isLoading,
    error,
  };
};
