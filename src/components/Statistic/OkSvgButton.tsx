const OkSvgButton = ({ onClick }: { onClick?: () => void }) => (
  
  
  <svg
    onClick={onClick}
    width="100"
    height="40"
    viewBox="0 0 100 40"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: 'pointer' }}
  >
    <rect
      x="1"
      y="1"
      width="98"
      height="38"
      rx="8"
      ry="8"
      fill="#8d4a5b"
      stroke="#ffffff"
      strokeWidth="3"
    />
    <text
      x="50"
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

export default OkSvgButton;
