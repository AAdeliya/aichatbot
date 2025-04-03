"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserDomains } from "@/actions/settings";
import { pusherClient } from "@/lib/utils";

type Domain = {
  id: string;
  name: string;
  icon: string | null;
};

type DomainContextType = {
  domains: Domain[] | null;
  isLoading: boolean;
  refreshDomains: () => Promise<void>;
};

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  const [domains, setDomains] = useState<Domain[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      const result = await getUserDomains();
      if (result.status === 200) {
        setDomains(result.domains);
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);

  // Set up real-time updates with Pusher
  useEffect(() => {
    if (!user?.id) return;

    const channel = pusherClient.subscribe(`user-${user.id}`);

    channel.bind("domain-added", (data: { domain: Domain }) => {
      setDomains((prevDomains) =>
        prevDomains ? [...prevDomains, data.domain] : [data.domain]
      );
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`user-${user.id}`);
    };
  }, [user?.id]);

  return (
    <DomainContext.Provider
      value={{
        domains,
        isLoading,
        refreshDomains: fetchDomains,
      }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error("useDomainContext must be used within a DomainProvider");
  }
  return context;
};
