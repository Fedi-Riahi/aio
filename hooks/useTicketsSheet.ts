import { useRef, useCallback, useState, useEffect } from "react";
import { TicketDrawer, Order, TicketData } from "../types/ticketsSheet";


interface ApiResponse<T> {
  success: boolean;
  respond: {
    data: T;
    error: Record<string, unknown>;
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
      if (!authTokensString) {
        console.error("No authTokens found in localStorage");
        return null;
      }
      return JSON.parse(authTokensString);
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
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(`https://api-prod.aio.events${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access_token}`,
          ...options.headers,
        },
      });

      // Only treat 404 as success for GET requests where resource might not exist
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // For successful DELETE with no content
      if (options.method === "DELETE" && response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.respond.error?.message || "Request failed");
      }

      return data.respond.data;
    },
    [getAuthTokens]
  );
  const fetchOrders = useCallback(
    async (updateState: boolean = true) => {
      try {
        setIsLoading(true);
        setError(null);
        const ordersData = await fetchWithAuth<Order[]>("/api/normalaccount/orders");
        console.log("Fetched orders from server:", ordersData);
        if (updateState) {
          setOrders(ordersData);
          if (ordersData.length === 0) {
            setError("No orders found");
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (updateState) {
          setError(error instanceof Error ? error.message : "Failed to load orders");
          setOrders([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchWithAuth]
  );

  const cancelOrder = useCallback(
    async (order_id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const order = orders.find((o) => o.order_id === order_id);
        if (!order || order.paymentMethod !== "Delivery") {
          throw new Error("Only orders in 'Delivery' state can be canceled");
        }

        console.log(`Attempting to delete order: ${order_id}`);

        // First optimistically update UI
        setOrders(prevOrders => prevOrders.filter(o => o.order_id !== order_id));

        // Then attempt deletion
        await fetchWithAuth(`/api/normalaccount/orders/${order_id}`, {
          method: "DELETE",
        });

        console.log(`Order ${order_id} deleted successfully`);

        // Refresh data to ensure consistency
        await fetchOrders(false);
      } catch (error) {
        console.error("Error canceling order:", error);

        // Revert UI if deletion failed
        fetchOrders(true);

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

        const orderData = await fetchWithAuth<any>(`/api/normalaccount/orders/${orderId}`);
        const tickets = orderData.tickets.map((ticket: any) => ({
          _id: ticket._id,
          eventName: orderData.event?.event_name || "Unknown Event",
          date: orderData.event?.date || "Unknown Date",
          time: orderData.event?.time || "Unknown Time",
          location: orderData.event?.location || "Unknown Location",
          referenceCode: ticket.reference_code || `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          background_thumbnail: orderData.event?.background_thumbnail || "",
          orderId: orderId,
        }));

        setTicketData(tickets);
        setSelectedOrder(orderId);
        if (tickets.length === 0) {
          setError("No tickets found for this order");
        }
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



  // Update useEffect to explicitly fetch orders
  useEffect(() => {
    if (open) {
      fetchOrders(true); // Explicitly update state on drawer open
    }
  }, [open, fetchOrders]);

  const handleDownloadPDF = useCallback(
    async (ticketId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const tokens = getAuthTokens();
        if (!tokens) {
          throw new Error("Authentication required. Please log in.");
        }

        // Simply navigate to the download endpoint - the API will handle the download
        window.open(
          `https://api-prod.aio.events/api/normalaccount/download/ticket/${ticketId}`,
          "_blank",
          `noopener,noreferrer,headers=Authorization:Bearer ${tokens.accessToken}`
        );
      } catch (error) {
        console.error("Error downloading ticket:", error);
        setError(error instanceof Error ? error.message : "Failed to download ticket");
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthTokens]
  );

  const handleDownloadAllTickets = useCallback(async () => {
    if (!selectedOrder) return;

    try {
      setIsLoading(true);
      setError(null);


      const tokens = getAuthTokens();
      if (!tokens) {
        throw new Error("Authentication required. Please log in.");
      }

      // Simply navigate to the download endpoint - the API will handle the download
      window.open(
        `https://api-prod.aio.events/api/normalaccount/download/order/${selectedOrder}`,
        "_blank",
        `noopener,noreferrer,headers=Authorization:Bearer ${tokens.accessToken}`
      );
    } catch (error) {
      console.error("Error downloading order tickets:", error);
      setError(error instanceof Error ? error.message : "Failed to download order tickets");
    } finally {
      setIsLoading(false);
    }
  }, [selectedOrder, getAuthTokens]);

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
