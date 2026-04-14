import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Info, ExternalLink, Share2, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check initial dark mode
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
    setAppUrl(window.location.origin);

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstallable(false);
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    // In a real app, this would request FCM permissions
    if (!notifications) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setNotifications(true);
          }
        });
      } else {
        alert('Notificações não suportadas neste navegador.');
      }
    } else {
      setNotifications(false);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dicas Fácil MZ',
          text: 'Aceda à nossa aplicação de notícias!',
          url: appUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(appUrl);
      alert('Link copiado!');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-950 min-h-screen pb-8">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Definições</h1>
      </header>

      <div className="p-4 space-y-6">
        {isInstallable && (
          <section>
            <div className="bg-gradient-to-r from-[#009639] to-[#007a2e] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg mb-1">Instalar Aplicação</h2>
                  <p className="text-sm text-green-100 mb-3">Adicione ao ecrã principal para acesso rápido e leitura offline.</p>
                  <button 
                    onClick={handleInstallClick}
                    className="bg-white text-[#009639] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Instalar Agora
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">Partilhar Aplicação</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden p-6 flex flex-col items-center text-center">
            <div className="bg-white p-3 rounded-xl shadow-sm mb-4 border border-gray-100">
              {appUrl && (
                <QRCodeSVG 
                  value={appUrl} 
                  size={160} 
                  level="H" 
                  fgColor="#000000" 
                  bgColor="#FFFFFF" 
                  imageSettings={{
                    src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLxahdSVwkEcfxn2tm2g9KnLL3U9-zCohLKkhK3aeHN-abjMe8d8LpXL59K3P_MteDplIbixtwRCwiRMKgChDmeGhCEL7ehWn1yV3sXaSog-bBR0ZQl6DcC7prxc0SEQnZ35907RN1z5CjKkf1CvlZ866iv6yBhrp4z9xW9Ilv8NeXEGJaEuF_IukgufJq/s72-c/square-image.png",
                    x: undefined,
                    y: undefined,
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Código QR da App</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Faça scan deste código com a câmara de outro telemóvel para aceder e instalar a aplicação.
            </p>
            <button 
              onClick={handleShareApp}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#009639] hover:bg-[#007a2e] text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              <Share2 className="w-5 h-5" />
              Partilhar Link
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">Preferências</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#009639]/10 flex items-center justify-center text-[#009639]">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Modo Escuro</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-[#009639]' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#009639]/10 flex items-center justify-center text-[#009639]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white block">Notificações</span>
                  <span className="text-xs text-gray-500">Alertas de novos artigos</span>
                </div>
              </div>
              <button 
                onClick={toggleNotifications}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-[#009639]' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">Sobre</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <a href="https://dicasfacilmz.blogspot.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#009639]/10 flex items-center justify-center text-[#009639]">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Visitar Website</span>
              </div>
            </a>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#009639]/10 flex items-center justify-center text-[#009639]">
                  <Info className="w-4 h-4" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">Versão da App</span>
              </div>
              <span className="text-sm text-gray-500">1.0.0</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
