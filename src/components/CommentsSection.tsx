import { useState } from 'react';
import CommentFormReact from './CommentFormReact';
import CommentList from './CommentList';
import { Comment } from '../types';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (name: string, comment: string) => void;
}

function CommentsSection({ comments, onAddComment }: CommentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleComments = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleComments();
    }
  };

  return (
    <section className="comments">
      <h2>Comments</h2>

      <button
        id="toggle-comments"
        className="show-hide"
        type="button"
        aria-expanded={isExpanded}
        onClick={toggleComments}
        onKeyDown={handleKeyDown}
      >
        {isExpanded ? 'Hide comments' : 'Show comments'}
      </button>

      {isExpanded && (
        <div id="comment-wrapper" className="comment-wrapper">
          <CommentFormReact onSubmit={onAddComment} />
          <CommentList comments={comments} />
        </div>
      )}
    </section>
  );
}

export default CommentsSection;
