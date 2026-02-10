import React from 'react';
import Link from 'next/link';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Traditional Crochet: Preserving Cultural Heritage",
      excerpt: "Discover the rich history of crochet and how our artisans are keeping this traditional craft alive.",
      date: "January 15, 2026",
      author: "MMWAFRIKA PRIDE Team",
      readTime: "5 min read",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1609505848912-c7c527a0aac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Sustainable Fashion: Why Handmade Beats Mass Production",
      excerpt: "Learn about the environmental benefits of choosing handcrafted crochet items over factory-made clothing.",
      date: "January 8, 2026",
      author: "Sarah Johnson",
      readTime: "4 min read",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Styling Your Crochet Accessories: From Casual to Formal",
      excerpt: "Get inspired with our styling tips for incorporating crochet pieces into your everyday wardrobe.",
      date: "December 28, 2025",
      author: "Emma Chen",
      readTime: "6 min read",
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Behind the Seams: Meet Our Artisan Collective",
      excerpt: "Get to know the talented hands and creative minds behind our beautiful crochet creations.",
      date: "December 20, 2025",
      author: "MMWAFRIKA PRIDE Team",
      readTime: "7 min read",
      category: "Community",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">MMWAFRIKA PRIDE Blog</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Discover stories about craftsmanship, sustainability, and the art of crochet.
          </p>
        </div>

        <div className="mb-12">
          <div className="relative h-96 rounded-xl overflow-hidden mb-8">
            <img 
              src="https://images.unsplash.com/photo-1609505848912-c7c527a0aac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Featured blog post" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-8">
              <div className="max-w-4xl">
                <span className="inline-block bg-gold text-black text-sm font-bold px-3 py-1 rounded mb-3">Featured</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  The Art of Traditional Crochet: Preserving Cultural Heritage
                </h2>
                <p className="text-foreground/80 mb-4 max-w-2xl">
                  Discover the rich history of crochet and how our artisans are keeping this traditional craft alive.
                </p>
                <div className="flex items-center text-sm text-foreground/60">
                  <span>January 15, 2026</span>
                  <span className="mx-2">•</span>
                  <span>MMWAFRIKA PRIDE Team</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article 
              key={post.id} 
              className="bg-foreground/5 rounded-lg overflow-hidden border border-foreground/10 hover:border-gold/30 transition-colors"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gold uppercase">{post.category}</span>
                  <span className="text-xs text-foreground/60">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{post.title}</h3>
                <p className="text-foreground/80 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-foreground/60">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.id}`} className="text-gold hover:underline font-medium">
                    Read more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-foreground/5 hover:bg-foreground/10 border border-foreground/20 text-foreground font-medium px-6 py-3 rounded-lg transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;