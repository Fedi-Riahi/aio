
export const handleSignOut = async () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("userData");
    localStorage.removeItem("userTickets");
    window.location.href = "/";
  };
