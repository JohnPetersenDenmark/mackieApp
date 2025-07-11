import React, { useEffect, useRef } from "react";
import { useCurrentUser } from "./CurrentUser";
import { useNavigate } from "react-router-dom";
import { useDashboardContext } from "./admin/DashboardContext";

type UserDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const { user, logout } = useCurrentUser();
  const { setIsOpen } = useDashboardContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!user || !isOpen) return null;

  const goToDashboard = () => {
    setIsOpen(true);
    navigate("/admin");
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        background: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        minWidth: "200px",
        zIndex: 1000,
        marginTop: "6px",
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#333",
      }}
    >
    
      <div
        onClick={goToDashboard}
        style={{
          padding: "10px 12px",
          color: "#222",
          cursor: "pointer",
          fontWeight: 400,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Administration
      </div>

      <div
        onClick={logout}
        style={{
          padding: "10px 12px",
           color: "#222",
          cursor: "pointer",
          fontWeight: 400,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fbeaea")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Logout
      </div>
    </div>
  );
}
