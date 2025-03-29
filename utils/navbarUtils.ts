export const handleScroll = (setScrolling: (value: boolean) => void) => () => {
    setScrolling(window.scrollY > 0);
  };
