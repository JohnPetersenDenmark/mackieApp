const NotOkSvgButton = ({ onClick }: { onClick?: () => void }) => (

   <svg
      width="140"
      height="40"
      viewBox="0 0 140 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      
     
      role="button"
      tabIndex={0}
      aria-label="OK not allowed button"
    >
      <rect
        x="1"
        y="1"
        width="138"
        height="38"
        rx="8"
        ry="8"
        fill="#8d4a5b"
      stroke="#ffffff"
     
        strokeWidth="2"
      />
      {/* No entry icon circle */}
      <circle cx="30" cy="20" r="12" fill="white" />
      <line
        x1="19"
        y1="19"
        x2="41"
        y2="21"
        stroke="#e53935"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* OK text */}
      <text
        x="80"
        y="25"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontFamily="Arial, sans-serif"
        dominantBaseline="middle"
      >
        OK
      </text>
    </svg>

);








export default NotOkSvgButton;