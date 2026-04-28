import { IconProps } from "@/src/props/icon_props";

export function IconSmartToy({ width = 24, height = 24, ...props }: IconProps) {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      fill="currentColor"
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M280-480q-17 0-28.5-11.5T240-520q0-17 11.5-28.5T280-560q17 0 28.5 11.5T320-520q0 17-11.5 28.5T280-480Zm400 0q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM480-200q39 0 69.5-26.5T585-290q3-14-6-22t-23-4q-22 9-45 13t-31 4q-8 0-31-4t-45-13q-14-4-23 4t-6 22q5 37 35.5 63.5T480-200Zm-200 40q-33 0-56.5-23.5T200-240v-400q0-33 23.5-56.5T280-720h400q33 0 56.5 23.5T760-640v400q0 33-23.5 56.5T680-160H280Zm0-80h400v-400H280v400Zm40-480h-80q0-50 35-85t85-35v80q-17 0-28.5 11.5T320-720ZM640-880q50 0 85 35t35 85h-80q0-17-11.5-28.5T640-800v-80Zm0 640H280h400Z"/>
    </svg>
  );
}
