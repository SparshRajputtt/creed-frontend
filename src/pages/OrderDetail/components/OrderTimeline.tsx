//@ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Package, Truck, MapPin } from "lucide-react";

interface OrderTimelineProps {
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }>;
  currentStatus: string;
}

const getStatusIcon = (status: string, isCompleted: boolean) => {
  const iconClass = `w-5 h-5 ${
    isCompleted ? "text-green-500" : "text-gray-400"
  }`;

  switch (status) {
    case "pending":
      return <Clock className={iconClass} />;
    case "confirmed":
      return <CheckCircle className={iconClass} />;
    case "processing":
      return <Package className={iconClass} />;
    case "shipped":
      return <Truck className={iconClass} />;
    case "delivered":
      return <MapPin className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Order Placed";
    case "confirmed":
      return "Order Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  statusHistory,
  currentStatus,
}) => {
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];
  const currentStatusIndex = statuses.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const historyItem = statusHistory.find(
              (item) => item.status === status
            );

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {getStatusIcon(status, isCompleted)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-medium ${
                        isCompleted ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {getStatusLabel(status)}
                    </h4>
                    {historyItem && (
                      <span className="text-xs text-gray-500">
                        {new Date(historyItem.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {historyItem?.note && (
                    <p className="text-sm text-gray-600 mt-1">
                      {historyItem.note}
                    </p>
                  )}

                  {historyItem?.updatedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Updated by {historyItem.updatedBy}
                    </p>
                  )}

                  {!historyItem && isCompleted && (
                    <p className="text-sm text-gray-500 mt-1">
                      Status updated automatically
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
