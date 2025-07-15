import React from "react";


interface CustomInputProps {
  value?: string;           // Optional in case DatePicker passes undefined initially
  onClick?: () => void;     // Optional in case DatePicker passes undefined initially
}

const CustomInputTruckLocation = React.forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick }, ref) => (


    <input
    type="text"
    onClick={onClick}
    value={value}
    readOnly // disables manual typing
    ref={ref}
     style={{
        cursor: "pointer",
        fontSize: "1.0rem",
        padding: "0.75rem",
        width: "80%",
      }}
    placeholder="MM-DD-YYYY"
  />
));

export default CustomInputTruckLocation;