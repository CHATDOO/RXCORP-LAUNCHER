import Link from 'next/link';
import { LayoutDashboard, Server, Newspaper, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-64 bg-black/90 h-screen border-r border-white/10 flex flex-col p-4 backdrop-blur-md fixed left-0 top-0">
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    RX
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-wider">RXCORP</h1>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-white bg-red-600/10 border border-red-600/20 rounded-xl transition-all hover:bg-red-600 hover:text-white group">
                    <LayoutDashboard size={20} className="text-red-500 group-hover:text-white" />
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link href="/servers" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Server size={20} />
                    <span className="font-medium">Serveurs</span>
                </Link>

                <Link href="/news" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Newspaper size={20} />
                    <span className="font-medium">Actualités</span>
                </Link>

                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings size={20} />
                    <span className="font-medium">Configuration</span>
                </Link>
            </nav>

            <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all mt-auto">
                <LogOut size={20} />
                <span className="font-medium">Déconnexion</span>
            </button>
        </div>
    );
}
