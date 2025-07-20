import React from "react";
import '../Statistic/TimePeriodSelector.css';

interface CustomInputProps {
  value?: string;           // Optional in case DatePicker passes undefined initially
  onClick?: () => void;     // Optional in case DatePicker passes undefined initially
}

const CustomInput = React.forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (


 /*  <input
    type="text"
    onClick={onClick}
    value={value}
    readOnly // disables manual typing
    ref={ref}
    style={{
      cursor: "pointer",
      fontSize: "1.0rem",
      padding: "0.4rem",
      width: "50%",
    }}
    placeholder="dd-mm-åååå"
  /> */

  <>
  
    <button
    onClick={onClick}
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#fff',
      cursor: 'pointer',
    }}
  >

    <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8d4a5b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
    
    <span style={{ marginLeft: '8px', color : '#8d4a5b' }}>{value || 'Vælg dato'}</span>
  </button>
  
  
  </>
  
));

export default CustomInput;