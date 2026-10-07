"use client"
import { Suspense } from "react";
import { HomeFeaturePage } from "@/src/features/home_feature/home_feature_page";
import { AppInitializer } from "@/src/shared/app_initializer";

function HomeContent() {
  return <HomeFeaturePage />;
}

export default function Page() {
  return (
    <AppInitializer>
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>
    </AppInitializer>
  );
}