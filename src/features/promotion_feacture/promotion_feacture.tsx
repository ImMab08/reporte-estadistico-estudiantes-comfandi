'use client'

import { PromotionUpload } from "./components/promotion_upload";
import { PromotionReport } from "./components/promotion_report";
import { usePromotionController } from "./hooks/usePromotionController";

export function PromotionFeature() {
  const controller = usePromotionController();

  const {
    promotionData,
    handleFileUpload,
    clearPromotionData,
  } = controller;

  if (!promotionData) {
    return (
      <PromotionUpload
        onUpload={handleFileUpload}
      />
    );
  }

  return (
    <PromotionReport
      data={promotionData}
      onClear={clearPromotionData}
    />
  );
}