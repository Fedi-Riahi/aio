import { useMemo } from "react";
import { TicketProps } from "../types/ticket";
import { getDefaultTicketProps } from "../utils/ticketUtils";

export const useTicket = (props: Partial<TicketProps>) => {
  const ticketProps = useMemo(() => getDefaultTicketProps(props), [props]);

  return { ticketProps };
};
