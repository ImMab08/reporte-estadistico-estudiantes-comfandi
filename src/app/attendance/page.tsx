import { connection } from "next/server";
import AttendanceFeature from "@/src/features/attendance_feature/attendance_feacture";
import prisma from "@/src/lib/prisma";

export default async function AttendancePage() {
  await connection();

  const activeYear = await prisma.academicYear.findFirst({
    where: { active: true },
    orderBy: { year: "desc" },
    select: { id: true },
  });

  const [teachers, groups] = await Promise.all([
    prisma.teacher.findMany({
      where: {
        active: true,
        user: { active: true },
      },
      select: {
        userId: true,
        user: { select: { fullName: true } },
      },
    }),
    prisma.group.findMany({
      where: { academicYearId: activeYear?.id ?? "" },
      select: {
        id: true,
        number: true,
        gradeLevel: { select: { code: true } },
      },
      orderBy: [{ gradeLevel: { name: "asc" } }, { number: "asc" }],
    }),
  ]);

  return (
    <AttendanceFeature
      teachers={teachers
        .map(({ userId, user }) => ({ userId, name: user.fullName }))
        .sort((first, second) => first.name.localeCompare(second.name, "es"))}
      groups={groups.map(({ id, number, gradeLevel }) => ({
        id,
        number,
        gradeCode: gradeLevel.code,
      }))}
    />
  );
}
