export interface TicketDrawer {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
  }

  export interface TicketData {
    eventName: string;
    date: string;
    time: string;
    location: string;
    referenceCode: string;
  }
