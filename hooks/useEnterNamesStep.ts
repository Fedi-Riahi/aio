import { useCallback } from "react";
import { EnterNamesStepProps } from "../types/enterNamesStep";

export const useEnterNamesStep = ({
  tickets,
  selectedTickets,
  userNames,
  handleNameChange,
  ticketType,
}: EnterNamesStepProps) => {
  const onNameChange = useCallback(
    (ticketId: string, index: number, value: string) => {
      handleNameChange(ticketId, index, value);
    },
    [handleNameChange]
  );

  return { onNameChange };
};
