type Props = {
  title: string;
  value: string | number;
  subtitle: string;
  color?: "emerald" | "red" | "blue";
};

export function PromotionKpiCard({
  title,
  value,
  subtitle,
  color = "emerald",
}: Props) {
  const styles = {
    emerald: {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      title: "text-emerald-700",
      value: "text-emerald-600",
    },

    blue: {
      border: "border-blue-200",
      bg: "bg-blue-100",
      title: "text-blue-700",
      value: "text-primary",
    },

    purple: {
      border: "border-violet-200",
      bg: "bg-violet-100",
      title: "text-violet-700",
      value: "text-violet-600",
    },

    red: {
      border: "border-red-200",
      bg: "bg-red-50",
      title: "text-red-700",
      value: "text-red-600",
    },
  };

  const current = styles[color];

  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        shadow-sm
        ${current.border}
        ${current.bg}
      `}
    >
      <p
        className={`
          text-sm
          font-semibold
          uppercase
          tracking-wide
          ${current.title}
        `}
      >
        {title}
      </p>

      <h2
        className={`
          text-3xl
          font-bold
          mt-4
          ${current.value}
        `}
      >
        {value}
      </h2>

      <p className="text-slate-500 mt-3">{subtitle}</p>
    </div>
  );
}
