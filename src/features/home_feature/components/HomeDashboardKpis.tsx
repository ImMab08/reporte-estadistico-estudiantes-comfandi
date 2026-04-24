import {
  IconGroup,
  IconSchool,
  // IconWorkspacePremium,
} from "@/src/shared/icons";

type DashboardKpisProps = {
  totalStudents: number;
  studentsAtRisk: number;
  topStudents: number;
  criticalSubjects: number;
};

function KpiCard({
  title,
  value,
  icon: Icon,
  variant = "blue",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: "blue" | "purple";
}) {
  const styles = {
    blue: {
      text: "text-primary",
      soft: "bg-blue-100",
      border: "from-blue-500 to-blue-200",
      ghost: "text-blue-400",
    },
    purple: {
      text: "text-violet-600",
      soft: "bg-violet-100",
      border: "from-violet-600 to-violet-200",
      ghost: "text-violet-400",
    },
  };

  const theme = styles[variant];

  return (
    <div
      className="
      relative overflow-hidden rounded-2xl md:rounded-3xl
      border border-slate-200 bg-white shadow-sm

      p-3 sm:p-4 md:p-5

      min-h-26.25 sm:min-h-32.5 md:min-h-42.5

      flex flex-col justify-between
      transition-all duration-300
    "
    >
      {/* Content */}
      <div className="relative z-10">
        <p
          className="
          text-[12px] sm:text-sm md:text-base
          text-slate-600 font-medium
          leading-tight
          max-w-[75%]
        "
        >
          {title}
        </p>

        <p
          className={`
          mt-1 sm:mt-2
          text-3xl sm:text-4xl md:text-5xl
          font-bold
          ${theme.text}
        `}
        >
          {value}
        </p>
      </div>

      {/* Icono fondo responsive */}
      <div
        className={`
        absolute
        right-1 bottom-1
        sm:right-2 sm:bottom-2
        md:right-3 md:bottom-3

        opacity-10
        ${theme.ghost}
      `}
      >
        <Icon
          className="
          w-14 h-14
          sm:w-20 sm:h-20
          md:w-28 md:h-28
          lg:w-32 lg:h-32
        "
        />
      </div>

      {/* Barra inferior */}
      <div
        className={`
        absolute bottom-0 left-0
        h-1 sm:h-1.5 md:h-2
        w-full
        bg-linear-to-r
        ${theme.border}
      `}
      />
    </div>
  );
}

export function DashboardKpis({
  totalStudents,
  studentsAtRisk,
  // topStudents,
}: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <KpiCard
        icon={IconGroup}
        title="Total de estudiantes"
        value={totalStudents}
        variant="blue"
      />

      <KpiCard
        icon={IconSchool}
        title="Estudiantes con dificultades"
        value={studentsAtRisk}
        variant="purple"
      />

      {/* Opcional */}
      {/* 
      <KpiCard
        icon={IconWorkspacePremium}
        title="Estudiantes destacados"
        value={topStudents}
        variant="blue"
      /> 
      */}
    </div>
  );
}
