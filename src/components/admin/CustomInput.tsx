import React from "react";
import '../Statistic/TimePeriodSelector.css';

interface CustomInputProps {
  value?: string;           // Optional in case DatePicker passes undefined initially
  onClick?: () => void;     // Optional in case DatePicker passes undefined initially
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick }, ref) => (


  <input
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
  />
));

export default CustomInput;