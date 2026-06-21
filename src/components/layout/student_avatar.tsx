"use client";

import Image from "next/image";
import { useState } from "react";

import { displayStudentName } from "@/src/utils/periodic/displayStudentName";

type Props = {
  name: string;
  photo?: string | null;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = {
  sm: {
    container: "w-10 h-10",
    text: "text-sm",
  },

  md: {
    container: "w-12 h-12",
    text: "text-base",
  },

  lg: {
    container: "w-16 h-16",
    text: "text-xl",
  },
};

export function StudentAvatar({
  name,
  photo,
  size = "md",
}: Props) {
  const [imageError, setImageError] = useState(false);

  const formattedName = displayStudentName(name);

  const parts = formattedName
    .trim()
    .split(" ")
    .filter(Boolean);

  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : (parts[0]?.[0] ?? "?").toUpperCase();

  const sizeClass = SIZE_CLASSES[size];

  if (!photo || imageError) {
    return (
      <div
        className={`
          ${sizeClass.container}
          rounded-full
          bg-primary/10
          text-primary
          flex
          items-center
          justify-center
          font-bold
          shrink-0
          ${sizeClass.text}
        `}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`
        relative
        ${sizeClass.container}
        rounded-full
        overflow-hidden
        shrink-0
        border
        border-slate-200
      `}
    >
      <Image
        src={photo}
        alt={formattedName}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}