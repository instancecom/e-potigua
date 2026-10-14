import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "petrol"
    | "action"
    | "success"
    | "warning"
    | "error"
    | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-background text-text-muted border-border-subtle",
    petrol: "bg-brand-petrol/10 text-brand-petrol border-brand-petrol/20",
    action: "bg-brand-action/10 text-brand-action border-brand-action/20",
    success: "bg-status-success/10 text-status-success border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
    error: "bg-status-error/10 text-status-error border-status-error/20",
    outline: "bg-transparent text-text-main border-border-subtle",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[8px] text-xs font-medium border transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

/**
 * Badge específico para os 4 status operacionais do PRODUCT.md:
 * Na fila | Lavando | Secando | Finalizado
 */
export function OperationStatusBadge({
  status,
  className,
}: {
  status: "na_fila" | "lavando" | "secando" | "finalizado";
  className?: string;
}) {
  const config = {
    na_fila: {
      label: "Na fila",
      variant: "warning" as const,
      dotClass: "bg-status-warning",
    },
    lavando: {
      label: "Lavando",
      variant: "action" as const,
      dotClass: "bg-brand-action animate-pulse",
    },
    secando: {
      label: "Secando",
      variant: "petrol" as const,
      dotClass: "bg-brand-petrol",
    },
    finalizado: {
      label: "Finalizado",
      variant: "success" as const,
      dotClass: "bg-status-success",
    },
  };

  const item = config[status];

  return (
    <Badge variant={item.variant} className={className}>
      <span className={cn("w-1.5 h-1.5 rounded-full", item.dotClass)} />
      <span>{item.label}</span>
    </Badge>
  );
}
