import { Check, X } from "lucide-react";
import { ORDER_STATUS_STEPS, ORDER_STATUS_LABELS, ORDER_STATUS_DESCRIPTIONS } from "@/lib/order-status";

export function OrderStatusTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
          <X size={16} />
        </span>
        <div>
          <p className="text-sm font-medium text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-600">{ORDER_STATUS_DESCRIPTIONS.CANCELLED}</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(status as (typeof ORDER_STATUS_STEPS)[number]);

  return (
    <div>
      <div className="flex items-center">
        {ORDER_STATUS_STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const isLast = i === ORDER_STATUS_STEPS.length - 1;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold " +
                    (done ? "border-foreground bg-foreground text-white" : "border-border bg-surface text-muted")
                  }
                >
                  {done ? <Check size={15} /> : i + 1}
                </span>
                <span className={"text-[11px] uppercase tracking-wide " + (done ? "text-foreground" : "text-muted")}>
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div className={"mx-1 mb-5 h-px flex-1 " + (i < currentIndex ? "bg-foreground" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-muted">{ORDER_STATUS_DESCRIPTIONS[status]}</p>
    </div>
  );
}
