"use client";

import { Attendance } from "@/features/operations/types";
import { updateAttendanceStatus } from "@/features/operations/actions";
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

  const handleStatusChange = async (newStatus: Attendance["status"]) => {
    setLoading(true);
    try {
      await updateAttendanceStatus(attendance.id, newStatus, unitId);
    } catch (err) {
      console.error(err);
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

      <div className="flex gap-2 mt-2">
        {attendance.status !== "lavando" && attendance.status !== "finalizado" && (
          <Button 
            size="compact" 
            disabled={loading} 
            onClick={() => handleStatusChange("lavando")}
          >
            Lavar
          </Button>
        )}
        {attendance.status === "lavando" && (
          <Button 
            size="compact" 
            variant="secondary"
            disabled={loading} 
            onClick={() => handleStatusChange("secando")}
          >
            Secar
          </Button>
        )}
        {attendance.status === "secando" && (
          <Button 
            size="compact" 
            variant="primary"
            disabled={loading} 
            onClick={() => handleStatusChange("finalizado")}
          >
            Finalizar
          </Button>
        )}
      </div>
    </Card>
  );
}
