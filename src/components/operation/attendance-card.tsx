"use client";

import { Attendance } from "@/features/operations/types";
import { updateAttendanceStatus } from "@/features/operations/actions";
import { finalizePaymentAction } from "@/features/finance/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OperationStatusBadge } from "@/components/ui/badge";
import { useState } from "react";

interface AttendanceCardProps {
  attendance: Attendance;
  unitId: string;
}

export function AttendanceCard({ attendance, unitId }: AttendanceCardProps) {
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleStatusChange = async (newStatus: Attendance["status"]) => {
    setLoading(true);
    try {
      await updateAttendanceStatus(attendance.id, newStatus, unitId);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (method: string) => {
    setLoading(true);
    try {
      await finalizePaymentAction(attendance.id, method, attendance.totalPrice);
      await updateAttendanceStatus(attendance.id, "finalizado", unitId);
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{attendance.vehicleId}</h3>
        <OperationStatusBadge status={attendance.status} />
      </div>
      
      <div className="text-sm text-gray-500">
        Total: R$ {attendance.totalPrice.toFixed(2)}
      </div>

      {!showPayment ? (
        <div className="flex gap-2 mt-2">
          {attendance.status === "na_fila" && (
            <Button size="compact" onClick={() => handleStatusChange("lavando")} disabled={loading}>Lavar</Button>
          )}
          {attendance.status === "lavando" && (
            <Button size="compact" variant="secondary" onClick={() => handleStatusChange("secando")} disabled={loading}>Secar</Button>
          )}
          {attendance.status === "secando" && (
            <Button size="compact" variant="primary" onClick={() => setShowPayment(true)} disabled={loading}>Receber & Finalizar</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button size="compact" variant="petrol" onClick={() => handlePayment("pix")} disabled={loading}>Pix</Button>
          <Button size="compact" variant="petrol" onClick={() => handlePayment("cash")} disabled={loading}>Dinheiro</Button>
          <Button size="compact" variant="petrol" onClick={() => handlePayment("debit_card")} disabled={loading}>Débito</Button>
          <Button size="compact" variant="petrol" onClick={() => handlePayment("credit_card")} disabled={loading}>Crédito</Button>
        </div>
      )}
    </Card>
  );
}
