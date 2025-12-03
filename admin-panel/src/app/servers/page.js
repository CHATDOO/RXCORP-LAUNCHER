import { Plus, Edit, Trash2, Server } from 'lucide-react';

export default function ServersPage() {
    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestion des Serveurs</h2>
                    <p className="text-gray-400">Ajoutez, modifiez ou supprimez des serveurs du launcher</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium">
                    <Plus size={20} />
                    Ajouter un serveur
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                <ServerItem name="PVP Faction" ip="play.rxcorp.fr" port="25565" status="online" />
                <ServerItem name="Skyblock" ip="sky.rxcorp.fr" port="25565" status="online" />
                <ServerItem name="Creative" ip="creative.rxcorp.fr" port="25565" status="maintenance" />
            </div>
        </div>
    );
}

function ServerItem({ name, ip, port, status }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/10">
                    <Server size={24} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{name}</h3>
                    <p className="text-gray-400 font-mono text-sm">{ip}:{port}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium uppercase ${status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {status}
                </span>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit size={20} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
