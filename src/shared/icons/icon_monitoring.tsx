import { IconProps } from "@/src/props/icon_props";

export function IconMonitoring({
  width = 24,
  height = 24,
  ...props
}: IconProps) {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      fill="currentColor"
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" />
    </svg>
  );
}
