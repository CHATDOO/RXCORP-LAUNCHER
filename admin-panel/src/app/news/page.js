import { Plus, Edit, Trash2, Newspaper } from 'lucide-react';

export default function NewsPage() {
    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Gestion des Actualités</h2>
                    <p className="text-gray-400">Publiez des annonces sur le launcher</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium">
                    <Plus size={20} />
                    Nouvelle actualité
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                <NewsItem
                    title="Mise à jour de Noël"
                    content="Découvrez les nouveaux événements de Noël sur le serveur..."
                    date="03/12/2025"
                    author="Admin"
                    status="published"
                />
                <NewsItem
                    title="Maintenance programmée"
                    content="Le serveur sera en maintenance ce soir à 22h..."
                    date="02/12/2025"
                    author="Modo"
                    status="archived"
                />
            </div>
        </div>
    );
}

function NewsItem({ title, content, date, author, status }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/10">
                    <Newspaper size={24} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-1">{content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{date}</span>
                        <span>•</span>
                        <span>{author}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-lg text-xs font-medium uppercase ${status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
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
