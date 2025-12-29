import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Tips for Sustainable Weight Loss',
      excerpt: 'Discover the science-backed strategies that will help you lose weight and keep it off for good.',
      author: 'Dr. Sarah Johnson',
      date: 'December 15, 2024',
      category: 'Weight Loss',
      image: '/api/placeholder/400/250',
      readTime: '5 min read',
      categoryColor: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Building Muscle After 40: A Complete Guide',
      excerpt: 'Learn how to build and maintain muscle mass as you age with proper training and nutrition.',
      author: 'Mike Thompson',
      date: 'December 12, 2024',
      category: 'Muscle Building',
      image: '/api/placeholder/400/250',
      readTime: '7 min read',
      categoryColor: 'bg-blue-500'
    },
    {
      id: 3,
      title: 'Stress Management Through Exercise: The Science',
      excerpt: 'Understand how physical activity can be your most powerful tool for managing stress and anxiety.',
      author: 'Dr. Emily Chen',
      date: 'December 10, 2024',
      category: 'Stress Relief',
      image: '/api/placeholder/400/250',
      readTime: '6 min read',
      categoryColor: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Home Workouts: Equipment-Free Exercises That Work',
      excerpt: 'Transform your living space into a gym with these effective bodyweight exercises.',
      author: 'Alex Rodriguez',
      date: 'December 8, 2024',
      category: 'Home Fitness',
      image: '/api/placeholder/400/250',
      readTime: '4 min read',
      categoryColor: 'bg-purple-500'
    },
    {
      id: 5,
      title: 'Nutrition Timing: When to Eat for Maximum Results',
      excerpt: 'Optimize your meal timing to enhance performance, recovery, and body composition.',
      author: 'Lisa Martinez',
      date: 'December 5, 2024',
      category: 'Nutrition',
      image: '/api/placeholder/400/250',
      readTime: '8 min read',
      categoryColor: 'bg-orange-500'
    },
    {
      id: 6,
      title: 'The Psychology of Fitness: Building Lasting Habits',
      excerpt: 'Discover the mental strategies that separate successful fitness enthusiasts from the rest.',
      author: 'Dr. James Wilson',
      date: 'December 3, 2024',
      category: 'Psychology',
      image: '/api/placeholder/400/250',
      readTime: '6 min read',
      categoryColor: 'bg-indigo-500'
    }
  ];

  const categories = [
    'All Posts',
    'Weight Loss',
    'Muscle Building',
    'Stress Relief',
    'Home Fitness',
    'Nutrition',
    'Psychology'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20" style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        padding: '5rem 0'
      }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">BitFit Pro Blog</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Expert insights, tips, and strategies to help you achieve your fitness goals and live a healthier life.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <div 
                    className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className={`absolute top-4 left-4 ${post.categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {post.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span className="font-medium">{post.readTime}</span>
                  </div>
                  
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter and never miss the latest fitness tips and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;