import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type CurrentUserType = {
  userName: string;
  email: string;
  displayname: string;
  roles: string[];
};

type UserContextType = { 
  user: CurrentUserType | null;
  authStatus: "loggedIn" | "expired" | "loggedOut";
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);
export const useCurrentUser = () => useContext(UserContext)!;

export function CurrentUser({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<CurrentUserType | null>(null);
  const [authStatus, setAuthStatus] = useState<"loggedIn" | "expired" | "loggedOut">("loggedOut");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setAuthStatus("loggedOut");
    navigate("/login"); // Redirect to login
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setAuthStatus("loggedOut");
      setUser(null);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        setUser({
          userName: decoded.customusername,
          email: decoded.customuseremail,
          displayname: decoded.displayname,
          roles: decoded.roles,
        });
        let x = user;
        let y = x;
        setAuthStatus("loggedIn");

        const timeout = decoded.exp * 1000 - Date.now();
        const logoutTimer = setTimeout(() => {
          setAuthStatus("expired");
          logout();
        }, timeout);

        return () => clearTimeout(logoutTimer);
      } else {
        setAuthStatus("expired");
        logout();
      }
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, authStatus, logout }}>
      {children}
    </UserContext.Provider>
  );
}
