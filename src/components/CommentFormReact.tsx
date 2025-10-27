import { FormEvent, useState } from 'react';

interface CommentFormReactProps {
  onSubmit: (name: string, comment: string) => void;
}

function CommentFormReact({ onSubmit }: CommentFormReactProps) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) {
      alert('Please fill in both fields');
      return;
    }

    onSubmit(name, comment);
    setName('');
    setComment('');
  };

  return (
    <form id="comment-form" className="comment-form" onSubmit={handleSubmit}>
      <h3>Add comment</h3>
      <div className="flex-pair">
        <label htmlFor="name">Your name:</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex-pair">
        <label htmlFor="comment">Your comment:</label>
        <input
          id="comment"
          name="comment"
          type="text"
          required
          autoComplete="off"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <input type="submit" value="Add comment" />
    </form>
  );
}

export default CommentFormReact;
