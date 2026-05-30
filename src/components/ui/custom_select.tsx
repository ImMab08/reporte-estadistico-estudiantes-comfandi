"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconSubdirectoryArrowRight,
  IconKeyboardArrowDown,
} from "@/src/shared/icons";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;

  disabled?: boolean;
  icon?: React.ReactNode;
};

export function CustomSelect({
  value,
  options,
  onChange,
  disabled,
  icon,
}: Props) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-primary">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`
          w-full
          flex items-center justify-between
          rounded-xl border border-slate-200
          px-3 py-2
          bg-white
          transition-all
          hover:border-slate-300
          hover:shadow-sm cursor-pointer
          ${disabled ? "bg-slate-100 opacity-70 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex items-center gap-2">
          {icon}

          <span className=" font-semibold">{selected?.label}</span>
        </div>

        <IconKeyboardArrowDown
          className={`
            size-4  transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* DROPDOWN */}
      {open && !disabled && (
        <div
          className="
            absolute z-50 mt-2 w-full
            overflow-hidden
            rounded-xl
            border border-slate-200
            bg-white
            shadow-xl
            animate-in fade-in zoom-in-95
            duration-100
          "
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full
                  flex items-center
                  px-4 py-2
                  space-x-3
                  text-sm
                  transition-colors
                  hover:bg-slate-50 cursor-pointer

                  ${
                    active
                      ? "bg-blue-50 text-primary font-medium"
                      : "text-slate-700"
                  }
                `}
              >
                {active && (
                  <IconSubdirectoryArrowRight className="size-4 text-primary" />
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
