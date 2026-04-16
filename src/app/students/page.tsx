"use client"
import { Suspense } from "react";
import { StudentsFeaturePage } from "@/src/features/students_report_feature/students_feature_page";

function StudentsContent () {
  return <StudentsFeaturePage />
}

export default function page() {
  return (
    <Suspense fallback={null}>
      <StudentsContent />
    </Suspense>
  )
}
