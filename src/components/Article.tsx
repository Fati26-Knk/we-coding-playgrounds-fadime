import { useEffect, useRef } from 'react';
import BearsTable from './BearsTable';
import AudioSection from './AudioSection';
import CommentsSection from './CommentsSection';
import BearList from './BearList';
import { Comment } from '../types';

interface ArticleProps {
  comments: Comment[];
  onAddComment: (name: string, comment: string) => void;
  searchQuery: string;
}

function Article({ comments, onAddComment, searchQuery }: ArticleProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!articleRef.current) return;

    // Remove previous highlights
    const article = articleRef.current;
    const highlights = article.querySelectorAll('mark.search-highlight');
    highlights.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize(); // Merge adjacent text nodes
      }
    });

    // Add new highlights if search query exists
    if (searchQuery && searchQuery.trim()) {
      const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          // Skip script, style, and already highlighted nodes
          const parent = node.parentElement;
          if (
            parent &&
            (parent.tagName === 'SCRIPT' ||
              parent.tagName === 'STYLE' ||
              parent.classList.contains('search-highlight'))
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodesToHighlight: { node: Text; matches: RegExpMatchArray[] }[] = [];
      const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');

      let currentNode: Node | null;
      while ((currentNode = walker.nextNode())) {
        const textNode = currentNode as Text;
        const matches = Array.from(textNode.textContent?.matchAll(regex) || []);
        if (matches.length > 0) {
          nodesToHighlight.push({ node: textNode, matches });
        }
      }

      // Apply highlights
      nodesToHighlight.forEach(({ node }) => {
        const text = node.textContent || '';
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        text.replace(regex, (match, ...args) => {
          const index = args[args.length - 2] as number;
          
          // Add text before match
          if (index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
          }

          // Add highlighted match
          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          mark.textContent = match;
          fragment.appendChild(mark);

          lastIndex = index + match.length;
          return match;
        });

        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode?.replaceChild(fragment, node);
      });
    }
  }, [searchQuery]);

  return (
    <article ref={articleRef}>
      <h2>The trouble with Bears</h2>
      <p>
        <strong>By Evan Wild</strong>
      </p>
      <p>
        Tall, lumbering, angry, dangerous. The real live bears of this world are proud, independent
        creatures, self-serving and always on the hunt for food.
      </p>

      <section>
        <h3>Types of bear</h3>
        <BearsTable />
      </section>

      <section>
        <h3>Habitats and Eating habits</h3>
        <p>
          Wild bears eat a variety of meat, fish, fruit, nuts, and other naturally growing
          ingredients...
        </p>
        <img src="/wild-bear.jpg" alt="Wild bear in forest" />

        <p>
          Urban (gentrified) bears on the other hand have largely abandoned the old ways...
        </p>
        <img src="/urban-bear.jpg" alt="Urban bear near buildings" />
      </section>

      <section>
        <h3>Mating rituals</h3>
        <p>Bears are romantic creatures by nature...</p>
        <AudioSection />
      </section>

      <aside>
        <h3>About the author</h3>
        <p>Evan Wild is an unemployed plumber from Doncaster...</p>
      </aside>

      <CommentsSection comments={comments} onAddComment={onAddComment} />

      <section className="more_bears">
        <h3>More Bears</h3>
        <BearList />
      </section>
    </article>
  );
}

export default Article;
