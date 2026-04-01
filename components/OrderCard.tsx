// components/OrderCard.tsx
'use client'

import React, { useState } from 'react'
import { Order, OrderStatus } from '@/types/order'
import { formatDistanceToNow } from 'date-fns'

interface OrderCardProps {
  order: Order
  onStatusUpdate: (orderId: string, status: OrderStatus) => void
  isUpdating: boolean
}

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return {
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        label: 'Pending',
        icon: '⏳',
      }
    case 'in_transit':
      return {
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        label: 'In Transit',
        icon: '🚚',
      }
    case 'delivered':
      return {
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        label: 'Delivered',
        icon: '✅',
      }
    default:
      return {
        color: 'text-gray-500',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/20',
        label: status,
        icon: '📦',
      }
  }
}

const formatTimestamp = (timestamp: string): string => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusUpdate,
  isUpdating,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const canUpdate = order.status !== 'delivered'
  const statusConfig = getStatusConfig(order.status)
  
  const getActionConfig = () => {
    if (order.status === 'pending') {
      return {
        label: 'Start Delivery',
        nextStatus: 'in_transit' as OrderStatus,
        color: 'bg-blue-600 hover:bg-blue-700',
        icon: '🚚',
      }
    } else if (order.status === 'in_transit') {
      return {
        label: 'Mark Delivered',
        nextStatus: 'delivered' as OrderStatus,
        color: 'bg-emerald-600 hover:bg-emerald-700',
        icon: '✅',
      }
    }
    return null
  }

  const actionConfig = getActionConfig()

  return (
    <div
      className={`bg-gray-800 rounded-xl border transition-all duration-300 ${
        isHovered
          ? 'border-blue-500 shadow-lg transform -translate-y-0.5'
          : 'border-gray-700'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1.5">
              {order.customerName}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-xs opacity-70">📞</span>
              <span className="text-sm text-gray-400">{order.phone}</span>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
          >
            <span className="text-sm">{statusConfig.icon}</span>
            <span className={`text-xs font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-700 mb-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Gas Quantity
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⛽</span>
              <span className="text-sm font-semibold text-white">
                {order.quantity}
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-700 mx-4" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Order Time
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🕐</span>
              <span className="text-sm font-semibold text-white">
                {formatTimestamp(order.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {canUpdate && actionConfig && (
          <button
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${actionConfig.color} ${
              isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
            }`}
            onClick={() => onStatusUpdate(order.id, actionConfig.nextStatus)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-base">{actionConfig.icon}</span>
                <span className="text-sm font-semibold text-white">
                  {actionConfig.label}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}