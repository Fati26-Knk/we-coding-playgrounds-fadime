import { FormEvent } from 'react';

interface NavigationProps {
  onSearch: (query: string) => void;
}

function Navigation({ onSearch }: NavigationProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q') as string;
    onSearch(query);
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Our team</a>
        </li>
        <li>
          <a href="#">Projects</a>
        </li>
        <li>
          <a href="#">Blog</a>
        </li>
      </ul>

      <form className="search" id="search-form" onSubmit={handleSubmit}>
        <label htmlFor="search-input" className="sr-only">
          Search website content
        </label>
        <input type="search" id="search-input" name="q" placeholder="Search query" />
        <input type="submit" value="Go!" />
      </form>
    </nav>
  );
}

export default Navigation;
