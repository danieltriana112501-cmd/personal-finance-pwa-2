"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { set, get, del } from "idb-keyval";
import { useState } from "react";

// Create a custom persister using idb-keyval for IndexedDB storage
const createIDBPersister = (idbValidKey: string = "reactQuery") => {
    return createAsyncStoragePersister({
        storage: {
            getItem: async (key: string) => await get(key),
            setItem: async (key: string, value: any) => await set(key, value),
            removeItem: async (key: string) => await del(key),
        },
        key: idbValidKey,
    });
};

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        gcTime: 1000 * 60 * 60 * 24, // 24 hours
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        retry: 3,
                    },
                },
            })
    );

    const [persister] = useState(() => {
        // Ensure this only runs on client
        if (typeof window !== "undefined") {
            return createIDBPersister();
        }
        return undefined;
    });

    if (typeof window === "undefined" || !persister) {
        // Fallback for SSR
        return (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    }

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
