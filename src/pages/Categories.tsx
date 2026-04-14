import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, BlogPost } from '../lib/blogger';
import { Hash } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const posts = await fetchPosts();
      const catMap = new Map<string, number>();
      
      posts.forEach(post => {
        post.categories.forEach(cat => {
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
        });
      });

      const catArray = Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
      catArray.sort((a, b) => b.count - a.count);
      
      setCategories(catArray);
      setLoading(false);
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-800 border-t-[#009639] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-950 min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Categorias</h1>
      </header>

      <div className="p-4 grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.name} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center aspect-square transition-transform active:scale-95">
            <div className="w-12 h-12 rounded-full bg-[#009639]/10 flex items-center justify-center mb-3 text-[#009639]">
              <Hash className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{cat.name}</h3>
            <p className="text-xs text-gray-500 font-medium">{cat.count} Artigos</p>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-2 text-center py-10 text-gray-500">
            Nenhuma categoria encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
