import type { MouseEventHandler } from "react";

interface IconProps {
  color?: string;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  title?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
}

const AssignStaffIcon: React.FC<IconProps> = ({
  color = "currentColor",
  size = 24,
  className = "",
  strokeWidth = "1.5",
  title,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill="none"
      stroke={color}
      strokeWidth={`${strokeWidth}`}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-tabler icons-tabler-outline icon-tabler-id-badge-2 ${className}`}
      onClick={onClick}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 12h3v4h-3z" />
      <path d="M10 6h-6a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1h-6" />
      <path d="M10 3m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
      <path d="M14 16h2" />
      <path d="M14 12h4" />
    </svg>
  );
};

export default AssignStaffIcon;
