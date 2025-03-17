"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconTruckDelivery, IconCreditCard, IconDiscount } from "@tabler/icons-react";

interface PaymentStepProps {
  paymentMode: "delivery" | "online" | null;
  handlePaymentModeChange: (mode: "delivery" | "online") => void;
  deliveryDetails: { name: string; prename: string; address: string };
  handleDeliveryChange: (field: "name" | "prename" | "address", value: string) => void;
  couponCode: string;
  handleCouponChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  applyCoupon: () => void;
  discount: number;
  calculateTotal: () => { subtotal: number; reduction: number; fee: number; total: number };
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMode,
  handlePaymentModeChange,
  deliveryDetails,
  handleDeliveryChange,
  couponCode,
  handleCouponChange,
  applyCoupon,
  discount,
  calculateTotal,
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleOnlinePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const payUrl = "https://sandbox.knct.me/ourwg3rlt";
      window.location.href = payUrl; 
    } catch (error) {
      console.error("Payment redirect error:", error);
      alert("An error occurred while redirecting to payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-offwhite rounded-lg shadow-md">
      {/* Payment Mode Selection */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Select Payment Mode</h2>
        <div className="flex gap-4">
          <Button
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg shadow-sm hover:shadow-md font-medium rounded-lg transition duration-300 ${
              paymentMode === "delivery"
                ? "bg-main text-foreground border-main"
                : "bg-offwhite text-foreground hover:bg-black/10"
            }`}
            onClick={() => handlePaymentModeChange("delivery")}
            disabled={isProcessingPayment}
          >
            <IconTruckDelivery stroke={1.5} size={24} />
            Delivery
          </Button>
          <Button
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg shadow-sm hover:shadow-md font-medium rounded-lg transition duration-300 ${
              paymentMode === "online"
                ? "bg-main text-foreground border-main"
                : "bg-offwhite text-foreground hover:bg-black/10"
            }`}
            onClick={() => handlePaymentModeChange("online")}
            disabled={isProcessingPayment}
          >
            <IconCreditCard stroke={1.5} size={24} />
            Online
          </Button>
        </div>
      </div>

      {/* Delivery Details */}
      {paymentMode === "delivery" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Delivery Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={deliveryDetails.name}
                onChange={(e) => handleDeliveryChange("name", e.target.value)}
                className="p-3 bg-offwhite text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isProcessingPayment}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Prename</label>
              <input
                type="text"
                placeholder="Enter your prename"
                value={deliveryDetails.prename}
                onChange={(e) => handleDeliveryChange("prename", e.target.value)}
                className="p-3 bg-offwhite text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isProcessingPayment}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                value={deliveryDetails.address}
                onChange={(e) => handleDeliveryChange("address", e.target.value)}
                className="p-3 bg-offwhite text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isProcessingPayment}
              />
            </div>
          </div>
        </div>
      )}

      {/* Apply Coupon */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Apply Coupon</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 p-3 border border-gray-500 rounded-lg">
            <IconDiscount stroke={1.5} size={24} className="text-gray-500" />
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={handleCouponChange}
              className="flex-1 p-3 rounded-lg focus:outline-none text-foreground bg-offwhite"
              disabled={isProcessingPayment}
            />
          </div>
          <Button
            className="px-6 py-3 bg-main text-foreground rounded-lg hover:bg-main/90 transition-all"
            onClick={applyCoupon}
            disabled={isProcessingPayment}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Order Summary and Payment Button */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-foreground">Subtotal</span>
            <span className="font-medium text-foreground">{calculateTotal().subtotal} DT</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground">Discount</span>
              <span className="font-medium text-green-600">-{discount}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground">Fee</span>
            <span className="font-medium text-foreground">
              {paymentMode === "delivery" ? "8 DT" : paymentMode === "online" ? "1.5 DT" : "0 DT"}
            </span>
          </div>
          <div className="flex justify-between border-offwhite border-t pt-2">
            <span className="text-foreground font-semibold">Total</span>
            <span className="font-bold text-main">{calculateTotal().total} DT</span>
          </div>
        </div>
        {paymentMode === "online" && (
          <Button
            className="mt-4 w-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
            onClick={handleOnlinePayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? "Processing..." : "Pay with Konnect"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;