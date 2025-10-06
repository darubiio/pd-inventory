"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createAbilityForUser,
  getAllowedLocationIds,
  hasLocationAccess as checkLocationAccess,
  getAllowedLocations,
  AppAbility,
} from "../permissions/abilities";
import { BranchLocation } from "../../types/user";
import {
  Action,
  Subject,
  PermissionsContextType,
} from "../../types/permissions";
import { useUser } from "../hooks/useUser";

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

interface PermissionsProviderProps {
  children: React.ReactNode;
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const { user, isLoading: userLoading } = useUser();
  const [ability, setAbility] = useState<AppAbility | null>(null);
  const [userLocations, setUserLocations] = useState<BranchLocation[]>([]);
  const [allowedLocationIds, setAllowedLocationIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setIsLoading(true);
      return;
    }

    const userAbility = createAbilityForUser(user);
    setAbility(userAbility);

    if (user) {
      const locations = getAllowedLocations(user);
      const locationIds = getAllowedLocationIds(user);

      setUserLocations(locations);
      setAllowedLocationIds(locationIds);
    } else {
      setUserLocations([]);
      setAllowedLocationIds([]);
    }

    setIsLoading(false);
  }, [user, userLoading]);

  const hasLocationAccess = (locationId: string): boolean => {
    return checkLocationAccess(user, locationId);
  };

  const canAccess = (
    action: Action,
    subject: Subject,
    field?: string
  ): boolean => {
    if (!ability) return false;
    return ability.can(action, subject, field);
  };

  const contextValue: PermissionsContextType = {
    ability,
    userLocations,
    allowedLocationIds,
    hasLocationAccess,
    canAccess,
    isLoading,
  };

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextType {
  const context = useContext(PermissionsContext);

  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }

  return context;
}

export function useAbility() {
  const { ability, canAccess } = usePermissions();
  return { ability, can: canAccess };
}

export function useLocations() {
  const { userLocations, allowedLocationIds, hasLocationAccess } =
    usePermissions();

  return {
    userLocations,
    allowedLocationIds,
    hasLocationAccess,
    filterAllowedLocations: <
      T extends { location_id?: string; branch_id?: string }
    >(
      locations: T[]
    ): T[] => {
      return locations.filter((location) => {
        const id = location.location_id || location.branch_id;
        return id ? hasLocationAccess(id) : false;
      });
    },
  };
}
