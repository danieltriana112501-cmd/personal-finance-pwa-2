"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LockKeyhole, Loader2, Mail } from "lucide-react";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error("Error al iniciar sesión", {
                    description: error.message,
                });
                return;
            }

            toast.success("¡Bienvenido de nuevo!");
            router.push("/");
            router.refresh();
        } catch (err) {
            toast.error("Error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                toast.error("Error al registrarse", {
                    description: error.message,
                });
                return;
            }

            toast.success("Cuenta creada", {
                description: "¡Bienvenido! Ya has iniciado sesión.",
            });
            router.push("/");
            router.refresh(); // Important for middleware rewrite
        } catch (err) {
            toast.error("Error inesperado en registro");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 font-[family-name:var(--font-geist-sans)] text-white relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[250px] w-[250px] rounded-full bg-orange-500/10 blur-[100px]" />

            <div className="z-10 w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-xl">
                        <LockKeyhole className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Vault Access</h1>
                    <p className="text-sm text-zinc-400">Ingresa tus credenciales para acceder</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                            <input
                                type="email"
                                required
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-900/20 backdrop-blur-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Contraseña</label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-900/20 backdrop-blur-sm transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/5 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                        {isLoading ? "Validando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-zinc-950 px-2 text-zinc-600">O crea una cuenta</span>
                    </div>
                </div>

                <button
                    onClick={handleSignUp}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-zinc-800 bg-transparent py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all"
                >
                    Registrarse
                </button>
            </div>
        </div>
    );
}
