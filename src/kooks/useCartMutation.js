import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  removeFromCart,
} from "../services/cartApi";

export const useCartMutations = ({ setPendingProductId }) => {
  const queryClient = useQueryClient();

  const updateCartOptimistically = (productId, updaterFn) => {
    const previousCart = queryClient.getQueryData(["cart"]);

    queryClient.setQueryData(["cart"], (old) => {
      const updatedItems = updaterFn(old?.items || []);
      return { ...old, items: updatedItems };
    });

    return { previousCart };
  };

  const restoreCart = (previousCart) => {
    if (previousCart) {
      queryClient.setQueryData(["cart"], previousCart);
    }
  };

  return {
    addMutation: useMutation({
      mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
      onMutate: async ({ productId }) => {
        setPendingProductId(productId);
        await queryClient.cancelQueries({ queryKey: ["cart"] });

        return updateCartOptimistically(productId, (items) => [
          ...items,
          { productId: { _id: productId }, quantity: 1 },
        ]);
      },
      onError: (_err, _variables, context) => {
        restoreCart(context.previousCart);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setPendingProductId(null);
      },
    }),

    increaseMutation: useMutation({
      mutationFn: ({ productId, quantity }) =>
        increaseCartItemQuantity(productId, quantity),
      onMutate: async ({ productId }) => {
        setPendingProductId(productId);
        await queryClient.cancelQueries({ queryKey: ["cart"] });

        return updateCartOptimistically(productId, (items) =>
          items.map((item) =>
            item.productId._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      },
      onError: (_err, _variables, context) => {
        restoreCart(context.previousCart);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setPendingProductId(null);
      },
    }),

    decreaseMutation: useMutation({
      mutationFn: ({ productId, quantity }) =>
        decreaseCartItemQuantity(productId, quantity),
      onMutate: async ({ productId }) => {
        setPendingProductId(productId);
        await queryClient.cancelQueries({ queryKey: ["cart"] });

        return updateCartOptimistically(productId, (items) =>
          items.map((item) =>
            item.productId._id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      },
      onError: (_err, _variables, context) => {
        restoreCart(context.previousCart);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setPendingProductId(null);
      },
    }),

    removeMutation: useMutation({
      mutationFn: (productId) => removeFromCart(productId),
      onMutate: async (productId) => {
        setPendingProductId(productId);
        await queryClient.cancelQueries({ queryKey: ["cart"] });

        return updateCartOptimistically(productId, (items) =>
          items.filter((item) => item.productId._id !== productId)
        );
      },
      onError: (_err, _variables, context) => {
        restoreCart(context.previousCart);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setPendingProductId(null);
      },
    }),
  };
};
