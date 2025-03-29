export interface CustomDrawerProps {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
  }

  export interface NavigationItem {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
