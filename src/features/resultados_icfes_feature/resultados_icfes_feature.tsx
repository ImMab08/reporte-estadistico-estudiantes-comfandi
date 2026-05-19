import Image from "next/image";

import { IcfesSidebar } from "./components/resultados_icfes_sidebar";
import { ResultadosIcfesDetails } from "./components/resultados_icfes_details";
import { useIcfesController } from "./hooks/use_icfes_controller";

type IcfesController = ReturnType<typeof useIcfesController>;

type Props = {
  controller: IcfesController;
};

export function ResultadosIcfesFeature({ controller }: Props) {
  const {
    hasData,
    selectedStudent,

    dataset,
    analytics,
    groupsAnalytics,
    comparisons,
    scoreDistribution,
    topStudents,
  } = controller;

  return (
    <section className="size-full bg-slate-50 p-3 md:p-4 flex flex-col overflow-hidden">
      <header className="mb-4 border-b border-border py-2 md:py-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Resultados ICFES
          </h1>

          <p className="text-xs md:text-base text-slate-500">
            Informe estadístico de las pruebas Saber 11
          </p>
        </div>

        <div className="w-24 h-12 relative">
          <Image
            src="/img/logo/logo_comfandi_blue.svg"
            alt="Comfandi"
            fill
            className="object-contain"
            priority
          />
        </div>
      </header>

      <section className="gap-4 hidden md:flex flex-1 min-h-0 overflow-hidden rounded-xl">
        <ResultadosIcfesDetails
          hasData={hasData}
          dataset={dataset}
          analytics={analytics}
          comparisons={comparisons}
          topStudents={topStudents}
          groupsAnalytics={groupsAnalytics}
          selectedStudent={selectedStudent}
          scoreDistribution={scoreDistribution}
          students={controller.students}
        />

        <IcfesSidebar controller={controller} />
      </section>
    </section>
  );
}
