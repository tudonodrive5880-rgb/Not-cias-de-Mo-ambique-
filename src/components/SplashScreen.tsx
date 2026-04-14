import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Keep the splash screen visible for 2.5 seconds to simulate app loading
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* Mozambique-themed Logo Icon */}
        <div className="relative w-28 h-28 mb-8">
          <div className="absolute inset-0 bg-[#009639] rounded-3xl rotate-6 opacity-90 shadow-lg"></div>
          <div className="absolute inset-0 bg-[#FCD116] rounded-3xl -rotate-3 opacity-90 shadow-lg"></div>
          <div className="absolute inset-0 bg-[#D21034] rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900">
            <span className="text-white text-5xl font-black tracking-tighter">MZ</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
          Dicas Fácil <span className="text-[#D21034]">MZ</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] uppercase text-xs">
          O Seu Portal de Notícias
        </p>
      </motion.div>

      <motion.div 
        className="absolute bottom-16 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-800 border-t-[#009639] rounded-full animate-spin mb-3"></div>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">A carregar...</span>
      </motion.div>
    </motion.div>
  );
}
