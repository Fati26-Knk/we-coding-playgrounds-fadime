import BearsTable from './BearsTable';
import AudioSection from './AudioSection';
import CommentsSection from './CommentsSection';
import { Comment } from '../types';

interface ArticleProps {
  comments: Comment[];
  onAddComment: (name: string, comment: string) => void;
  searchQuery: string;
}

function Article({ comments, onAddComment }: ArticleProps) {
  return (
    <article>
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
      </section>
    </article>
  );
}

export default Article;
