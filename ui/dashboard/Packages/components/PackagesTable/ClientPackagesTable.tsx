"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAbortableRequest } from "../../../../../lib/hooks/useAbortableRequest";
import { PackagesTable } from "./PackagesTable";
import { Location } from "../../../../../types";
import { getDefaultDates } from "../../utils/utils";

type ClientPackagesTableProps = {
  warehouse?: Location;
  locationId: string;
};

async function fetchPackages(
  locationId: string,
  start?: string,
  end?: string,
  signal?: AbortSignal
) {
  const params = new URLSearchParams({ location_id: locationId });
  if (start) params.set("date_start", start);
  if (end) params.set("date_end", end);

  const res = await fetch(`/api/zoho/packages?${params.toString()}`, {
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch packages");
  }

  const json = await res.json();
  return json.data || [];
}

export const ClientPackagesTable = ({
  warehouse,
  locationId,
}: ClientPackagesTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [initialLoading, setInitialLoading] = React.useState(true);

  const urlDateStart = searchParams.get("date_start");
  const urlDateEnd = searchParams.get("date_end");

  const { dateStart, dateEnd } = getDefaultDates();
  const currentDateStart = urlDateStart || dateStart;
  const currentDateEnd = urlDateEnd || dateEnd;

  const fetchPackagesCallback = useCallback(
    async (start: string, end: string, signal?: AbortSignal) => {
      const data = await fetchPackages(locationId, start, end, signal);
      return data;
    },
    [locationId]
  );

  const {
    data,
    isLoading,
    error: requestError,
    execute,
  } = useAbortableRequest(fetchPackagesCallback, { debounceMs: 0 });

  useEffect(() => {
    execute(currentDateStart, currentDateEnd);
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
      setError("Failed to load packages. Please try again.");
      setInitialLoading(false);
    }
  }, [requestError]);

  const handleDateChange = useCallback(
    (start: string, end: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("date_start", start);
      params.set("date_end", end);
      router.push(`?${params.toString()}`, { scroll: false });

      execute(start, end);
    },
    [execute, router, searchParams]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    execute(currentDateStart, currentDateEnd);
  }, [execute, currentDateStart, currentDateEnd]);

  const handleRefresh = useCallback(() => {
    execute(currentDateStart, currentDateEnd);
  }, [execute, currentDateStart, currentDateEnd]);

  const handlePackageUpdate = useCallback((updatedPackage: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.package_id === updatedPackage.package_id
          ? {
              ...row,
              status: updatedPackage.status,
              shipment_order: updatedPackage.shipment_order,
            }
          : row
      )
    );
  }, []);

  return (
    <PackagesTable
      data={rows as any}
      warehouse={warehouse}
      defaultDateStart={currentDateStart}
      defaultDateEnd={currentDateEnd}
      onDateChange={handleDateChange}
      loading={isLoading}
      error={error}
      onRetry={handleRetry}
      onRefresh={handleRefresh}
      onPackageUpdate={handlePackageUpdate}
      initialLoading={initialLoading}
    />
  );
};
