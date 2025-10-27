import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

function CommentList({ comments }: CommentListProps) {
  return (
    <ul id="comment-list" className="comment-container" aria-live="polite">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-item">
          <p>
            <strong>{comment.name}</strong>
          </p>
          <p>{comment.comment}</p>
          <p className="comment-timestamp">
            <small>{new Date(comment.timestamp).toLocaleString()}</small>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
