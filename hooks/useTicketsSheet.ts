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

  // Add this to your existing useTicketsSheet hook
const cancelOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const tokens = getAuthTokens();
      if (!tokens) {
        throw new Error("Authentication required. Please log in.");
      }

      // First, check if the order is in "Delivery" state
      const order = orders.find(o => o.order_id === orderId);
      if (!order || order.paymentState !== "Delivery") {
        throw new Error("Only orders in 'Delivery' state can be canceled");
      }

      const response = await fetch(`https://api-prod.aio.events/api/normalaccount/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.status}`);
      }

      // Refresh the orders list after successful cancellation
      await fetchOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
      setError(error instanceof Error ? error.message : 'Failed to cancel order');
    } finally {
      setIsLoading(false);
    }
  }, [getAuthTokens, orders, fetchOrders]);

  const handleDownloadPDF = useCallback(async (index: number) => {
    const ticket = ticketData[index];

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create mock PDF content
      const mockPdfContent = `
        %PDF-1.4
        1 0 obj
        << /Type /Catalog /Pages 2 0 R >>
        endobj
        2 0 obj
        << /Type /Pages /Kids [3 0 R] /Count 1 >>
        endobj
        3 0 obj
        << /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
        endobj
        4 0 obj
        << /Length 44 >>
        stream
        BT /F1 12 Tf 72 720 Td (Ticket: ${ticket.referenceCode}) Tj ET
        endstream
        endobj
        xref
        0 5
        0000000000 65535 f
        0000000009 00000 n
        0000000058 00000 n
        0000000111 00000 n
        0000000196 00000 n
        trailer
        << /Size 5 /Root 1 0 R >>
        startxref
        300
        %%EOF
      `;

      // Create blob from mock data
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `MOCK_ticket_${ticket.referenceCode}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log('Simulated PDF download for ticket:', ticket.referenceCode);

    } catch (error) {
      console.error('Error in simulated download:', error);
      setError('Simulated download failed');
    }
  }, [ticketData]);

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
    cancelOrder,
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
