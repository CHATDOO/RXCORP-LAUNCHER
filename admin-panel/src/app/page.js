import { Users, Server, Activity, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400">Vue d'ensemble du launcher RXCORP</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Système Opérationnel</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Joueurs en ligne"
          value="1,245"
          icon={<Users size={24} className="text-blue-500" />}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Serveurs Actifs"
          value="8"
          icon={<Server size={24} className="text-purple-500" />}
          trend="Stable"
          trendUp={true}
        />
        <StatCard
          title="Trafic Launcher"
          value="15k"
          icon={<Activity size={24} className="text-green-500" />}
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="Alertes"
          value="0"
          icon={<AlertCircle size={24} className="text-red-500" />}
          trend="Aucune"
          trendUp={true}
        />
      </div>

      {/* Recent Activity / Servers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">État des Serveurs</h3>
          <div className="space-y-4">
            <ServerStatus name="PVP Faction" status="online" players="450" />
            <ServerStatus name="Skyblock" status="online" players="320" />
            <ServerStatus name="Creative" status="maintenance" players="0" />
            <ServerStatus name="Survival" status="online" players="180" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Dernières Actualités</h3>
          <div className="space-y-4">
            <NewsItem title="Mise à jour de Noël" date="Il y a 2 heures" author="Admin" />
            <NewsItem title="Maintenance programmée" date="Il y a 1 jour" author="Modo" />
            <NewsItem title="Nouveau spawn" date="Il y a 3 jours" author="Builder" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl">
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function ServerStatus({ name, status, players }) {
  return (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <div>
          <h4 className="font-medium text-white">{name}</h4>
          <p className="text-xs text-gray-400 capitalize">{status}</p>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-300">
        {players} joueurs
      </div>
    </div>
  );
}

function NewsItem({ title, date, author }) {
  return (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
      <div>
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-xs text-gray-400">{date} • par {author}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
        →
      </div>
    </div>
  );
}
