"use client";

import { IconQuickReference } from "@/src/shared/icons";

type Props = {
  onUpload: (file: File) => Promise<void>;
};

export function PromotionUpload({ onUpload }: Props) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    await onUpload(file);
  }

  return (
    <div className="size-full h-screen flex flex-col space-y-10 items-center justify-center">
      <div className="text-center text-slate-400">
        <IconQuickReference className="size-14 mx-auto mb-3" />
        <p>No hay datos cargados</p>  
      </div>

      <label className="bg-primary px-6 py-2 text-white rounded-xl cursor-pointer">
        Cargar archivo
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
