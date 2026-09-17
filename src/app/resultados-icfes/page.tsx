"use client";

import { Suspense } from "react";

import { ResultadosIcfesFeature } from "@/src/features/resultados_icfes_feature/resultados_icfes_feature"; 
import { useIcfesController } from "@/src/features/resultados_icfes_feature/hooks/use_icfes_controller";

function ResultadoIcfesContent() {
  const controller =
    useIcfesController();

  return (
    <ResultadosIcfesFeature
      controller={controller}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResultadoIcfesContent />
    </Suspense>
  );
}