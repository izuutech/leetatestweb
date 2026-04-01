// components/OrderDashboard.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "./OrderCard";
import { OrderStatus } from "@/types/order";

type FilterType = "all" | OrderStatus;

const filters: { id: FilterType; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "📋" },
  { id: "pending", label: "Pending", icon: "⏳" },
  { id: "in_transit", label: "In Transit", icon: "🚚" },
  { id: "delivered", label: "Delivered", icon: "✅" },
];

export const OrderDashboard: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const {
    orders,
    isLoading,
    isRefreshing,
    error,
    refetch,
    updateOrderStatus,
    isUpdating,
  } = useOrders();

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter,
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_transit: orders.filter((o) => o.status === "in_transit").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const getFilterCount = (filterId: FilterType): number => {
    switch (filterId) {
      case "all":
        return stats.total;
      case "pending":
        return stats.pending;
      case "in_transit":
        return stats.in_transit;
      case "delivered":
        return stats.delivered;
      default:
        return 0;
    }
  };

  const handleStatusUpdate = useCallback(
    (orderId: string, status: OrderStatus) => {
      updateOrderStatus({ orderId, status });
    },
    [updateOrderStatus],
  );

  if (isLoading && !isRefreshing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-400 mb-1">Welcome back,</p>
              <h1 className="text-3xl font-bold text-white">Agent Dashboard</h1>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-3xl">
              🎯
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Manage and track gas deliveries
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded-lg p-4 text-center hover:transform hover:-translate-y-0.5 transition-all">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Total Orders
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center hover:transform hover:-translate-y-0.5 transition-all">
              <div className="text-2xl font-bold text-orange-500">
                {stats.pending}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Pending
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center hover:transform hover:-translate-y-0.5 transition-all">
              <div className="text-2xl font-bold text-blue-500">
                {stats.in_transit}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                In Transit
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center hover:transform hover:-translate-y-0.5 transition-all">
              <div className="text-2xl font-bold text-emerald-500">
                {stats.delivered}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Delivered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  filter === filterItem.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <span className="text-base">{filterItem.icon}</span>
                <span className="text-sm font-medium">{filterItem.label}</span>
                {filter === filterItem.id && (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {getFilterCount(filterItem.id)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md border border-gray-700">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Connection Error
              </h3>
              <p className="text-gray-400 mb-6">
                {error.message ||
                  "Unable to load orders. Please check your internet connection."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md border border-gray-700">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-400 mb-6">
                {filter !== "all"
                  ? `No ${filter === "in_transit" ? "in transit" : filter} orders available at the moment.`
                  : "There are no orders to display."}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Refresh FAB */}
      <button
        onClick={() => refetch()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="Refresh orders"
      >
        <span className="text-2xl text-white">⟳</span>
      </button>
    </div>
  );
};
