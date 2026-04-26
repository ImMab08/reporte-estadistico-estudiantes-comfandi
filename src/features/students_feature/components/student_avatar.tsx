"use client";

import { displayStudentName } from "@/src/utils/displayStudentName";
import Image from "next/image";
import { useState } from "react";

type Props = {
  name: string;
  photo: string;
};

export function StudentAvatar({ name, photo }: Props) {
  const [imageError, setImageError] = useState(false);

  const formattedName = displayStudentName(name);
  const parts = formattedName.trim().split(" ");

  const initial =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  if (!photo || imageError) {
    return (
      <div className="w-16 h-16 rounded-full bg-blue-200 text-primary flex items-center justify-center font-bold text-xl shrink-0">
        {initial}
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-slate-200">
      <Image
        src={photo}
        alt={name}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
