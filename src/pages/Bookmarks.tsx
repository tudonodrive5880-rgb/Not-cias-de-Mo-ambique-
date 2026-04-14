import { useState, useEffect, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BlogPost } from '../lib/blogger';
import { BookmarkX } from 'lucide-react';

export default function Bookmarks() {
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setSavedPosts(saved);
  }, []);

  const removeBookmark = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const newSaved = savedPosts.filter(p => p.id !== id);
    localStorage.setItem('bookmarks', JSON.stringify(newSaved));
    setSavedPosts(newSaved);
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-950 min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Artigos Guardados</h1>
      </header>

      <div className="p-4 space-y-4">
        {savedPosts.map(post => (
          <Link key={post.id} to={`/article/${encodeURIComponent(post.id)}`} className="flex gap-4 group relative bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
              {post.thumbnailUrl && (
                <img 
                  src={post.thumbnailUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div className="flex flex-col justify-center py-1 pr-8">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-1">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
                {formatDistanceToNow(new Date(post.published), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
            <button 
              onClick={(e) => removeBookmark(e, post.id)}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-[#D21034] hover:bg-[#D21034]/10 rounded-full transition-colors"
            >
              <BookmarkX className="w-4 h-4" />
            </button>
          </Link>
        ))}

        {savedPosts.length === 0 && (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <BookmarkX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhum artigo guardado</h3>
            <p className="text-sm text-gray-500">Os artigos que guardar aparecerão aqui para ler mais tarde.</p>
          </div>
        )}
      </div>
    </div>
  );
}
