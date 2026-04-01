// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/order";

export const useOrders = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.fetchOrders,
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: Order["status"];
    }) => orderService.updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previousOrders = queryClient.getQueryData(["orders"]);

      queryClient.setQueryData(["orders"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((order: Order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        };
      });

      return { previousOrders };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["orders"], context?.previousOrders);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders: data?.orders || [],
    totalOrders: data?.total || 0,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    error: error as Error | null,
    refetch,
    updateOrderStatus: updateOrderMutation.mutate,
    isUpdating: updateOrderMutation.isPending,
  };
};
