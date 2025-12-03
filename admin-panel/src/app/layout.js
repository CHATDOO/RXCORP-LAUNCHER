import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'RXCORP Admin Panel',
  description: 'Gestion du launcher RXCORP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
