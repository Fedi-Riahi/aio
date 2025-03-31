"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { TicketDrawer, Order, TicketData } from "../types/ticketsSheet";

// Mock data for orders (unchanged)
const mockOrders: Order[] = [
  {
    order_id: "ORD001",
    event_name: "Summer Music Festival",
    ticketsCount: 2,
    totalPrice: 59.98,
    paymentState: "paid",
    _id: "2025-03-01T10:00:00Z",
    owners: "Festival Co.",
    paymentMethod: "credit_card",
    deliveryState: 1,
  },
  {
    order_id: "ORD002",
    event_name: "Tech Conference 2025",
    ticketsCount: 1,
    totalPrice: 99.99,
    paymentState: "pending",
    _id: "2025-03-15T09:00:00Z",
    owners: "Tech Events Inc.",
    paymentMethod: "paypal",
    deliveryState: 1,
  },
];

// Mock data for tickets with background_thumbnail
const mockTickets: TicketData[] = [
  {
    _id: "TCK001",
    eventName: "Summer Music Festival",
    date: "April 10, 2025",
    time: "18:00 - 22:00",
    location: "Central Park, NYC",
    referenceCode: "REF-SMF001",
    orderId: "ORD001",
    background_thumbnail: "https://images.unsplash.com/photo-1741835063505-f76fdcb4d510?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    _id: "TCK002",
    eventName: "Summer Music Festival",
    date: "April 10, 2025",
    time: "18:00 - 22:00",
    location: "Central Park, NYC",
    referenceCode: "REF-SMF002",
    orderId: "ORD001",
  },
  {
    _id: "TCK003",
    eventName: "Tech Conference 2025",
    date: "March 15, 2025",
    time: "09:00 - 17:00",
    location: "Convention Center, SF",
    referenceCode: "REF-TC001",
    orderId: "ORD002",
    background_thumbnail: "https://via.placeholder.com/300x500?text=Tech+Conf",
  },
];

export const useTicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const ticketRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeDrawer = useCallback(() => {
    onOpenChange(false);
    setSelectedOrder(null);
    setError(null);
  }, [onOpenChange]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const ordersData = mockOrders;
      setOrders(ordersData);
      console.log("orders", ordersData);

      if (ordersData.length === 0) {
        setError("No orders found");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTicketsForOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const tickets = mockTickets.filter((ticket) => ticket.orderId === orderId || orderId === "");

      setTicketData(tickets);
      setSelectedOrder(orderId === "" ? null : orderId);

      if (tickets.length === 0) {
        setError("No tickets found for this order");
      }
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load tickets");
      setTicketData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownloadPDF = useCallback(async (index: number) => {
    const ticket = ticketData[index];
    try {
      console.log(`Simulating PDF download for ticket: ${ticket.referenceCode}`);
      const mockBlob = new Blob(["Mock Ticket PDF"], { type: "application/pdf" });
      const url = window.URL.createObjectURL(mockBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket_${ticket.referenceCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading ticket:", error);
      setError("Failed to download ticket");
    }
  }, [ticketData]);

  const handleDownloadAllTickets = useCallback(async () => {
    if (!selectedOrder) return;

    try {
      console.log(`Simulating PDF download for all tickets in order: ${selectedOrder}`);
      const mockBlob = new Blob([`Mock PDF for order ${selectedOrder}`], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(mockBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order_${selectedOrder}_tickets.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading all tickets:", error);
      setError("Failed to download tickets");
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open, fetchOrders]);

  return {
    open,
    closeDrawer,
    ticketRefs,
    handleDownloadPDF,
    handleDownloadAllTickets,
    ticketData,
    orders,
    selectedOrder,
    fetchTicketsForOrder,
    isLoading,
    error,
  };
};
