import React from "react";
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
  return (
    <div className="flex flex-col gap-8 p-6 bg-white rounded-lg shadow-md">

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Select Payment Mode</h2>
        <div className="flex gap-4">
          <Button
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg shadow-sm hover:shadow-md font-medium brounded-lg transition duration-300 ${
              paymentMode === "delivery"
                ? "bg-main text-white border-main"
                : "bg-black/10 text-black  hover:bg-black/20"
            }`}
            onClick={() => handlePaymentModeChange("delivery")}
          >
            <IconTruckDelivery stroke={1.5} size={24} />
            Delivery
          </Button>
          <Button
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg shadow-sm hover:shadow-md font-medium  rounded-lg transition duration-300 ${
              paymentMode === "online"
                ? "bg-main text-white border-main"
                : "bg-black/10 text-black  hover:bg-black/20"
            }`}
            onClick={() => handlePaymentModeChange("online")}
          >
            <IconCreditCard stroke={1.5} size={24} />
            Online
          </Button>
        </div>
      </div>

      {paymentMode === "delivery" && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Delivery Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={deliveryDetails.name}
                onChange={(e) => handleDeliveryChange("name", e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Prename</label>
              <input
                type="text"
                placeholder="Enter your prename"
                value={deliveryDetails.prename}
                onChange={(e) => handleDeliveryChange("prename", e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                value={deliveryDetails.address}
                onChange={(e) => handleDeliveryChange("address", e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
              />
            </div>
          </div>
        </div>
      )}


      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Apply Coupon</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
            <IconDiscount stroke={1.5} size={24} className="text-gray-500" />
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={handleCouponChange}
              className="flex-1 p-2 focus:outline-none"
            />
          </div>
          <Button
            className="px-6 py-3 bg-main text-white rounded-lg hover:bg-main/90 transition-all"
            onClick={applyCoupon}
          >
            Apply
          </Button>
        </div>
      </div>


      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-medium">{calculateTotal().subtotal} DT</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Discount</span>
              <span className="font-medium text-green-600">-{discount}%</span>
            </div>
          )}
          <div className="flex justify-between">
          <span className="text-gray-700">Fee</span>
            <span className="font-medium">
            {paymentMode === "delivery" 
                ? "8 DT" 
                : paymentMode === "online" 
                ? "1.5 DT" 
                : "0 DT"}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-700 font-semibold">Total</span>
            <span className="font-bold text-main">{calculateTotal().total} DT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;