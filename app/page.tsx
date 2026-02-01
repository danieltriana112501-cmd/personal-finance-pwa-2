"use client";

import { useState } from "react";
import { FastTrackDashboard } from "@/components/dashboard/fast-track-dashboard";
import { AnalysisView } from "@/components/dashboard/analysis-view";
import { PlusCircle, PieChart, Wallet } from "lucide-react";
import { SettingsDrawer } from "@/components/settings/settings-drawer";
import { cn } from "@/lib/utils";

export default function Home() {
  const [view, setView] = useState<"entry" | "analysis">("entry");

  return (
    <main className="min-h-screen bg-black text-white relative">
      <div className="pb-20">
        {view === "entry" ? <FastTrackDashboard /> : <AnalysisView />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 p-2 pb-6 px-6 flex justify-around items-center z-50">
        <button
          onClick={() => setView("entry")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            view === "entry" ? "text-white" : "text-zinc-500"
          )}
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Entrada</span>
        </button>

        <button
          onClick={() => setView("analysis")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            view === "analysis" ? "text-white" : "text-zinc-500"
          )}
        >
          <PieChart className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Análisis</span>
        </button>

        <SettingsDrawer />
      </div>
    </main>
  );
}
