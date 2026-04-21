import { StudentDetailsFeacture } from "../student_details_feature"; 
import type { useStudentsController } from "../hooks/use_students_controller";

type StudentsController = ReturnType<
	typeof useStudentsController
>;

type Props = {
  controller: StudentsController;
};

export function StudentDetails({ controller }: Props) {
  const {
    selectedStudent,
    activeSnapshot,
    comparisonData,
  } = controller;

  return (
    <StudentDetailsFeacture
      selectedStudent={selectedStudent}
      activeSnapshot={activeSnapshot}
      comparisonChartData={comparisonData}
    />
  );
}