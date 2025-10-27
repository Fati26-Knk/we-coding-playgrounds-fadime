import { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Article from './components/Article';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { Comment } from './types';

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load comments from localStorage on mount
  useEffect(() => {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleAddComment = (name: string, comment: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      name,
      comment,
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search highlighting logic here
    // This will be done in the Article component
  };

  return (
    <>
      <Header />
      <Navigation onSearch={handleSearch} />
      <main>
        <Article comments={comments} onAddComment={handleAddComment} searchQuery={searchQuery} />
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}

export default App;
