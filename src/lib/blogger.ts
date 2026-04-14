export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  author: string;
  categories: string[];
  thumbnailUrl?: string;
  link: string;
}

const BLOG_URL = 'https://dicasfacilmz.blogspot.com';
const FEED_URL = `${BLOG_URL}/feeds/posts/default?alt=json`;
// Using a CORS proxy to prevent "Failed to fetch" errors in the browser
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(FEED_URL)}`;

export async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(PROXY_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    
    if (!data.feed || !data.feed.entry) {
      return [];
    }

    return data.feed.entry.map((entry: any) => {
      // Extract thumbnail
      let thumbnailUrl = entry.media$thumbnail?.url;
      if (thumbnailUrl) {
        // Get higher resolution image by replacing /s72-c/ with /s600/
        thumbnailUrl = thumbnailUrl.replace(/\/s\d+-c\//, '/s600/');
      } else {
        // Try to extract first image from content
        const content = entry.content?.$t || '';
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          thumbnailUrl = imgMatch[1];
        }
      }

      // Extract categories
      const categories = entry.category ? entry.category.map((c: any) => c.term) : [];

      // Extract original link
      const link = entry.link.find((l: any) => l.rel === 'alternate')?.href || '';

      return {
        id: entry.id.$t,
        title: entry.title.$t,
        content: entry.content?.$t || '',
        published: entry.published.$t,
        updated: entry.updated.$t,
        author: entry.author?.[0]?.name?.$t || 'Author',
        categories,
        thumbnailUrl,
        link,
      };
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}
