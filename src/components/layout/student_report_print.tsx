import Image from "next/image";

export default function StudentReportPrint() {
  return (
    <section className="p-4">
      <header className="mb-4 border-b border-border py-2 md:py-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Reporte académico
          </h1>

          <p className="text-xs md:text-base text-slate-500">
            Rendimiento individual del estudiante
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-24 h-12 relative -right-5">
            <Image
              src="/img/logo/logo_edumetricks.png"
              alt="Edumetricks"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="w-px self-stretch bg-slate-300 rounded-full" />

          <div className="w-24 h-12 relative">
            <Image
              src="/img/logo/logo_comfandi_blue.svg"
              alt="Comfandi"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </header>
    </section>
  );
}
