import { useRef, useCallback, useState, useEffect } from "react";
import { TicketDrawer, Order, TicketData } from "../types/ticketsSheet";
import toast from "react-hot-toast";

interface ApiResponse<T> {
  success: boolean;
  respond: {
    data: T;
    error?: { message?: string };
  };
}

interface OrderWithTickets {
  tickets: Array<{
    _id: string;
    reference_code?: string;
  }>;
  event?: {
    event_name?: string;
    date?: string;
    time?: string;
    location?: string;
    background_thumbnail?: string;
  };
}

export const useTicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const ticketRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthTokens = useCallback(() => {
    try {
      const authTokensString = localStorage.getItem("authTokens");
      return authTokensString ? JSON.parse(authTokensString) : null;
    } catch (error) {
      console.error("Error parsing auth tokens:", error);
      return null;
    }
  }, []);

  const closeDrawer = useCallback(() => {
    onOpenChange(false);
    setSelectedOrder(null);
    setError(null);
  }, [onOpenChange]);

  const fetchWithAuth = useCallback(
    async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
      const tokens = getAuthTokens();
      if (!tokens?.access_token) {
        toast("Authentification requise. Veuillez vous connecter.")
      }

      const response = await fetch(`https://api-prod.aio.events${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access_token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (options.method === "DELETE" && response.status === 204) {
        return {} as T;
      }

      const data: ApiResponse<T> = await response.json();
      if (!data.success) {
        throw new Error(data.respond.error?.message || "Request failed");
      }

      return data.respond.data;
    },
    [getAuthTokens]
  );

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const ordersData = await fetchWithAuth<Order[]>("/api/normalaccount/orders");
      setOrders(ordersData);
      if (ordersData.length === 0) {
        setError("No orders found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error instanceof Error ? error.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  const cancelOrder = useCallback(
    async (order_id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const order = orders.find((o) => o.order_id === order_id);
        if (!order || order.paymentMethod !== "Delivery") {
          toast.error("Seules les commandes en état 'Livraison' peuvent être annulées.");
        }

        // Optimistic update
        setOrders(prevOrders => prevOrders.filter(o => o.order_id !== order_id));

        await fetchWithAuth(`/api/normalaccount/order/${order_id}`, {
          method: "DELETE",
        });
        await fetchWithAuth<Order[]>("/api/normalaccount/orders");
        toast.success("Votre commande a été annulée avec succès.")
      } catch (error) {
        console.error("Error canceling order:", error);
        fetchOrders(); // Revert by refetching
        setError(
          error instanceof Error
            ? error.message
            : "Failed to cancel order. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithAuth, orders, fetchOrders]
  );

  const fetchTicketsForOrder = useCallback(
    async (orderId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!orderId) {
          setSelectedOrder(null);
          setTicketData([]);
          return;
        }

        const orderData = await fetchWithAuth<OrderWithTickets>(`/api/normalaccount/order/${orderId}`);

        if (!orderData?.tickets) {
          throw new Error("Invalid order data: tickets missing");
        }

        const tickets = (orderData.tickets || []).map((ticket) => ({
          _id: ticket._id,
          eventName: orderData.event?.event_name || "Unknown Event",
          date: orderData.event?.date || "Unknown Date",
          time: orderData.event?.time || "Unknown Time",
          location: orderData.event?.location || "Unknown Location",
          referenceCode: ticket.reference_code || `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          background_thumbnail: orderData.event?.background_thumbnail || "",
          orderId,
        }));

        setTicketData(tickets);
        setSelectedOrder(orderId);
        setError(tickets.length === 0 ? "No tickets found for this order" : null);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError(error instanceof Error ? error.message : "Failed to load tickets");
        setTicketData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithAuth]
  );

  const handleDownload = useCallback(
    async (url: string) => {
      try {
        const tokens = getAuthTokens();
        if (!tokens?.access_token) {
          throw new Error("Authentication required");
        }

        window.open(
          `https://api-prod.aio.events${url}`,
          "_blank",
          `noopener,noreferrer,headers=Authorization:Bearer ${tokens.access_token}`
        );
      } catch (error) {
        console.error("Download error:", error);
        setError(error instanceof Error ? error.message : "Download failed");
      }
    },
    [getAuthTokens]
  );

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open, fetchOrders]);

  return {
    open,
    closeDrawer,
    ticketRefs,
    cancelOrder,
    handleDownloadPDF: (ticketId: string) =>
      handleDownload(`/api/normalaccount/download/ticket/${ticketId}`),
    handleDownloadAllTickets: () =>
      selectedOrder && handleDownload(`/api/normalaccount/download/order/${selectedOrder}`),
    ticketData,
    orders,
    selectedOrder,
    fetchTicketsForOrder,
    isLoading,
    error,
  };
};
