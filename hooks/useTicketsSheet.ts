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

      const authTokens = JSON.parse(authTokensString);
      if (!authTokens.access_token) {
        console.error("Access token missing in authTokens");
        return null;
      }

      return {
        accessToken: authTokens.access_token,
        refreshToken: authTokens.refresh_token
      };
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

  const fetchWithAuth = useCallback(async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
    const tokens = getAuthTokens();
    if (!tokens) {
      throw new Error("Authentication required. Please log in.");
    }

    const response = await fetch(`https://api-prod.aio.events/api/normalaccount/orders`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.accessToken}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.respond.error?.message || 'Request failed');
    }

    return data.respond.data;
  }, [getAuthTokens]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const ordersData = await fetchWithAuth<Order[]>('/api/normalaccount/orders');
      setOrders(ordersData);
      console.log("orders",ordersData)

      if (ordersData.length === 0) {
        setError("No orders found");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  const fetchTicketsForOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const orderData = await fetchWithAuth<any>(`https://api-prod.aio.events/api/normalaccount/${orderId}`);

      const tickets = orderData.tickets.map((ticket: any) => ({
        _id: ticket._id,
        eventName: orderData.event?.event_name || "Unknown Event",
        date: ticket.date || "Unknown Date",
        time: ticket.time || "Unknown Time",
        location: orderData.event?.location || "Unknown Location",
        referenceCode: ticket.reference_code || `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        orderId: orderId
      }));

      setTicketData(tickets);
      setSelectedOrder(orderId);

      if (tickets.length === 0) {
        setError("No tickets found for this order");
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tickets');
      setTicketData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  const handleDownloadPDF = useCallback(async (index: number) => {
    const ticket = ticketData[index];
    try {
      const response = await fetchWithAuth(`https://api-prod.aio.events/api/normalaccount/download/ticket/${ticket._id}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${ticket.referenceCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setError(error instanceof Error ? error.message : 'Failed to download ticket');
    }
  }, [ticketData, fetchWithAuth]);

  const handleDownloadAllTickets = useCallback(async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetchWithAuth(`https://api-prod.aio.events/api/normalaccount/download/order/${selectedOrder}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order_${selectedOrder}_tickets.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading all tickets:', error);
      setError(error instanceof Error ? error.message : 'Failed to download tickets');
    }
  }, [selectedOrder, fetchWithAuth]);

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
    error
  };
};
