import { PromotionSnapshot } from "../promotion.types";

type Props = {
  data: PromotionSnapshot;
};

export function PromotionHeader({ data }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-primary">Promoción Final</h1>

        <p className="text-slate-500">Resultados finales del año escolar</p>
      </div>
    </div>
  );
}
