import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import parse from 'html-react-parser';
import { fetchPosts, BlogPost } from '../lib/blogger';
import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from 'lucide-react';

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      const posts = await fetchPosts();
      const foundPost = posts.find(p => p.id === decodeURIComponent(id || ''));
      setPost(foundPost || null);
      setLoading(false);

      // Check bookmarks
      if (foundPost) {
        const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(saved.some((p: BlogPost) => p.id === foundPost.id));
      }
    };
    loadPost();
  }, [id]);

  const toggleBookmark = () => {
    if (!post) return;
    const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (isBookmarked) {
      const newSaved = saved.filter((p: BlogPost) => p.id !== post.id);
      localStorage.setItem('bookmarks', JSON.stringify(newSaved));
      setIsBookmarked(false);
    } else {
      saved.push(post);
      localStorage.setItem('bookmarks', JSON.stringify(saved));
      setIsBookmarked(true);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: 'Veja este artigo no Dicas Fácil MZ',
          url: post.link,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(post.link);
      alert('Link copiado!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-800 border-t-[#009639] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-950 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Artigo não encontrado</h2>
        <button onClick={() => navigate('/')} className="text-[#009639] font-medium">Voltar ao início</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-950 min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleBookmark} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-[#009639]" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <button onClick={handleShare} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <article>
        {post.thumbnailUrl && (
          <div className="w-full aspect-video bg-gray-100 dark:bg-gray-900">
            <img 
              src={post.thumbnailUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        
        <div className="px-5 py-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(cat => (
              <span key={cat} className="px-2.5 py-1 text-[10px] font-bold bg-[#009639]/10 text-[#009639] dark:bg-[#009639]/20 rounded-full uppercase tracking-wider">
                {cat}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 rounded-full bg-[#FCD116]/20 flex items-center justify-center text-[#D21034] font-bold text-lg">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{post.author}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {format(new Date(post.published), "d 'de' MMMM, yyyy • HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="prose prose-blue dark:prose-invert max-w-none prose-img:rounded-xl prose-img:w-full prose-a:text-[#009639]">
            {parse(post.content)}
          </div>
        </div>
      </article>
    </div>
  );
}
