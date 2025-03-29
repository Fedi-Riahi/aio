import { TicketProps } from "../types/ticket";

export const getDefaultTicketProps = (props: Partial<TicketProps>): TicketProps => ({
  eventName: "HARDWAVE TEK SECOND RELEASE",
  date: "23 NOV 2024",
  time: "00:30",
  location: "CERCLE - GAMMARTH CLUB",
  referenceCode: "S.BRTV0C",
  qrValue: `https://api-prod.aio.events${encodeURIComponent(props.referenceCode || "S.BRTV0C")}`,
  className: "",
  ...props,
});
