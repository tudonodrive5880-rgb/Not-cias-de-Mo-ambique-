import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fetchPosts, BlogPost } from '../lib/blogger';
import { RefreshCw, Search } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  // Extract unique categories
  const allCategories = Array.from(new Set(posts.flatMap(post => post.categories)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory ? post.categories.includes(activeCategory) : true;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts[0];
  const recentPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-800 border-t-[#009639] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-950 min-h-screen">
      {/* Header with MZ Logo */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-[#009639] rounded-lg rotate-6 opacity-90"></div>
            <div className="absolute inset-0 bg-[#FCD116] rounded-lg -rotate-3 opacity-90"></div>
            <div className="absolute inset-0 bg-[#D21034] rounded-lg flex items-center justify-center border-2 border-white dark:border-gray-900">
              <span className="text-white text-xs font-black">MZ</span>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            Dicas Fácil
          </h1>
        </div>
        <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar notícias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-[#009639] focus:ring-2 focus:ring-[#009639]/20 transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Categories Scroll */}
      {allCategories.length > 0 && (
        <div className="px-4 pb-2 -mt-1 overflow-x-auto no-scrollbar flex gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeCategory === null 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            Todas
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#009639] text-white' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 pb-6 space-y-6 mt-2">
        {/* Featured Post */}
        {featuredPost && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-4 bg-[#D21034] rounded-full"></div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Destaque</h2>
            </div>
            <Link to={`/article/${encodeURIComponent(featuredPost.id)}`} className="block group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-3 shadow-sm">
                {featuredPost.thumbnailUrl ? (
                  <img 
                    src={featuredPost.thumbnailUrl} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Sem imagem</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    {featuredPost.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="px-2.5 py-1 text-[10px] font-bold bg-[#009639] text-white rounded-full uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight mb-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-xs font-medium text-gray-300">
                    {formatDistanceToNow(new Date(featuredPost.published), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Recent Posts List */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-4 bg-[#FCD116] rounded-full"></div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Últimas Notícias</h2>
          </div>
          <div className="space-y-4">
            {recentPosts.map(post => (
              <Link key={post.id} to={`/article/${encodeURIComponent(post.id)}`} className="flex gap-4 group bg-white dark:bg-gray-950 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
                  {post.thumbnailUrl && (
                    <img 
                      src={post.thumbnailUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    {post.categories[0] && (
                      <span className="text-[10px] font-bold text-[#D21034] uppercase tracking-wider">
                        {post.categories[0]}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-[#009639] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-auto">
                    {formatDistanceToNow(new Date(post.published), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </Link>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-gray-500 font-medium">
                Nenhuma notícia encontrada.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
