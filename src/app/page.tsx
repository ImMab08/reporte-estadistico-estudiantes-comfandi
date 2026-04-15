import { Suspense } from "react";
import { HomeFeaturePage } from "@/src/features/home_feature/home_feature_page";

function HomeContent() {
  return <HomeFeaturePage />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}