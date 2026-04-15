import { Suspense } from "react";
import StudentModalContent from "@/src/shared/modals/student_modal_content"; 

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StudentModalContent />
    </Suspense>
  );
}