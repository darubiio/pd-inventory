"use client";

import React from "react";
import { PackagesTable } from "../PackagesTable";

export default function ClientPackagesTable({
  locationId,
  initialData,
  defaultStart,
  defaultEnd,
}: {
  locationId: string;
  initialData: any[];
  defaultStart: string;
  defaultEnd: string;
}) {
  const [rows, setRows] = React.useState<any[]>(initialData);
  const [loading, setLoading] = React.useState(false);

  const handleDateChange = async (start?: string, end?: string) => {
    setLoading(true);
    const params = new URLSearchParams({ location_id: locationId });
    if (start) params.set("date_start", start);
    if (end) params.set("date_end", end);
    try {
      const res = await fetch(`/api/zoho/packages?${params.toString()}`);
      if (!res.ok) return;
      const json = await res.json();
      setRows(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PackagesTable
      data={rows as any}
      defaultDateStart={defaultStart}
      defaultDateEnd={defaultEnd}
      onDateChange={handleDateChange}
      loading={loading}
    />
  );
}
