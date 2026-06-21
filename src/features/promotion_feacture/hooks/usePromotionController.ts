"use client";

import { useState } from "react";

import { parseExcel } from "@/src/utils/periodic/parseExcel";
import {
  processPromotionData,
  PromotionSnapshot,
} from "../utils/processPromotionData";

import {
  clearPromotionSnapshot,
  getPromotionSnapshot,
  savePromotionSnapshot,
} from "../utils/promotionStorage";

export function usePromotionController() {
  const [promotionData, setPromotionData] = useState<PromotionSnapshot | null>(
    () => getPromotionSnapshot(),
  );

  async function handleFileUpload(file: File) {
    try {
      const excelData = await parseExcel(file);

      const snapshot = processPromotionData({
        data: excelData,
        fileName: file.name,
      });

      savePromotionSnapshot(snapshot);

      setPromotionData(snapshot);
    } catch (error) {
      console.error(error);
      alert("Error procesando archivo");
    }
  }

  function clearPromotionData() {
    clearPromotionSnapshot();
    setPromotionData(null);
  }

  return {
    promotionData,
    handleFileUpload,
    clearPromotionData,
  };
}
