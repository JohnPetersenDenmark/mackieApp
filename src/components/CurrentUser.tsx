import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type CurrentUserType = {
  userName: string;
  email: string;
  displayname: string;
  roles: string[];
};

export const UserContext = createContext<CurrentUserType | null>(null);
export const useCurrentUser = () => useContext(UserContext);

export function CurrentUser({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<CurrentUserType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        setUser({
          userName: decoded.userName,
          email: decoded.userName,
          displayname: decoded.displayname,
          roles: decoded.roles,
        });

        const timeout = decoded.exp * 1000 - Date.now();
        const logoutTimer = setTimeout(() => {
          localStorage.removeItem("token");
          setUser(null);
        }, timeout);

        return () => clearTimeout(logoutTimer);
      } else {
        localStorage.removeItem("authToken");
        setUser(null);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
