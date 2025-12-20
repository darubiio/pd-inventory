"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAbortableRequest } from "../../../../../lib/hooks/useAbortableRequest";
import { ReceivingTable } from "./ReceivingTable";
import { Location } from "../../../../../types";
import { getDefaultDates } from "../../../Packages/utils/utils";

type ClientReceivingTableProps = {
  warehouse?: Location;
  locationId: string;
};

async function fetchReceives(
  locationId: string,
  start?: string,
  end?: string,
  status?: string,
  signal?: AbortSignal
) {
  const params = new URLSearchParams({ location_id: locationId });
  if (start) params.set("date_start", start);
  if (end) params.set("date_end", end);
  if (status) params.set("status", status);

  const res = await fetch(`/api/zoho/receiving?${params.toString()}`, {
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch purchase receives");
  }

  const json = await res.json();
  return json.data || [];
}

export const ClientReceivingTable = ({
  warehouse,
  locationId,
}: ClientReceivingTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [initialLoading, setInitialLoading] = React.useState(true);

  const urlDateStart = searchParams.get("date_start");
  const urlDateEnd = searchParams.get("date_end");
  const urlStatus = searchParams.get("status");

  const { dateStart, dateEnd } = getDefaultDates();
  const currentDateStart = urlDateStart || dateStart;
  const currentDateEnd = urlDateEnd || dateEnd;
  const currentStatus = urlStatus || "in_transit";

  const fetchReceivesCallback = useCallback(
    async (start: string, end: string, status: string, signal?: AbortSignal) =>
      fetchReceives(locationId, start, end, status, signal),
    [locationId]
  );

  const {
    data,
    isLoading,
    error: requestError,
    execute,
  } = useAbortableRequest(fetchReceivesCallback, { debounceMs: 0 });

  useEffect(() => {
    execute(currentDateStart, currentDateEnd, currentStatus);
  }, []);

  useEffect(() => {
    if (data) {
      setRows(data);
      setError(null);
      setInitialLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (requestError) {
      setError("Failed to load purchase orders. Please try again.");
      setInitialLoading(false);
    }
  }, [requestError]);

  const handleDateChange = useCallback(
    (start: string, end: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("date_start", start);
      params.set("date_end", end);
      router.push(`?${params.toString()}`, { scroll: false });

      execute(start, end, currentStatus);
    },
    [execute, router, searchParams, currentStatus]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("status", status);
      router.push(`?${params.toString()}`, { scroll: false });

      setRows([]);
      execute(currentDateStart, currentDateEnd, status);
    },
    [execute, router, searchParams, currentDateStart, currentDateEnd]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    execute(currentDateStart, currentDateEnd, currentStatus);
  }, [execute, currentDateStart, currentDateEnd, currentStatus]);

  const handleRefresh = useCallback(() => {
    execute(currentDateStart, currentDateEnd, currentStatus);
  }, [execute, currentDateStart, currentDateEnd, currentStatus]);

  return (
    <ReceivingTable
      data={rows as any}
      warehouse={warehouse}
      defaultDateStart={currentDateStart}
      defaultDateEnd={currentDateEnd}
      defaultStatus={currentStatus}
      onDateChange={handleDateChange}
      onStatusChange={handleStatusChange}
      loading={isLoading}
      error={error}
      onRetry={handleRetry}
      onRefresh={handleRefresh}
      initialLoading={initialLoading}
    />
  );
};
