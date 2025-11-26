/**
 * CommentForm Web Component
 *
 * A custom element that encapsulates the "Add comment" form using Shadow DOM.
 * This component demonstrates:
 * - Shadow DOM for style encapsulation
 * - HTML Template syntax
 * - Custom Events for parent communication
 * - Accessibility features (ARIA, labels)
 *
 * @fires comment-added - Dispatched when a new comment is submitted
 *
 * @example
 * ```html
 * <comment-form></comment-form>
 * ```
 *
 * @example
 * ```typescript
 * document.querySelector('comment-form')?.addEventListener('comment-added', (e) => {
 *   console.log('New comment:', e.detail);
 * });
 * ```
 */
export class CommentForm extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private readonly form: HTMLFormElement | null = null;
  private readonly nameInput: HTMLInputElement | null = null;
  private readonly commentInput: HTMLInputElement | null = null;

  constructor() {
    super();

    // Create Shadow DOM (encapsulation mode)
    this.shadow = this.attachShadow({ mode: 'open' });

    // Render template
    this.render();

    // Get references to form elements
    this.form = this.shadow.querySelector('form');
    this.nameInput = this.shadow.querySelector('#name');
    this.commentInput = this.shadow.querySelector('#comment');

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Renders the component template and styles into Shadow DOM
   */
  private render(): void {
    this.shadow.innerHTML = `
      ${this.getStyles()}
      ${this.getTemplate()}
    `;
  }

  /**
   * Returns encapsulated styles for the component
   * These styles are isolated and won't affect the rest of the page
   */
  private getStyles(): string {
    return `
      <style>
        /* Component Host Styles */
        :host {
          display: block;
          margin-bottom: 3rem;
        }

        /* Form Container */
        form {
          margin-bottom: 2rem;
        }

        /* Flex Pair Layout (Label + Input) */
        .flex-pair {
          display: flex;
          padding: 0 3rem 1rem;
          align-items: center;
        }

        /* Label Styling */
        label {
          align-self: center;
          flex: 2;
          text-align: right;
          font-size: 1.8rem;
          line-height: 36px;
          font-weight: 500;
          color: #f0f0f0; /* Very light for excellent readability */
        }

        /* Input Field Styling */
        input[type="text"] {
          margin-left: 1rem;
          flex: 6;
          font-size: 1.8rem;
          line-height: 36px;
          padding: 8px;
          background-color: #ffffff; /* White background */
          color: #1a1a1a; /* Dark text */
          border: 2px solid #4a8a4a; /* Green border */
          border-radius: 4px;
          font-family: inherit;
        }

        /* Input Focus State (Accessibility) */
        input[type="text"]:focus {
          outline: none;
          border-color: #6ac86a; /* Bright green */
          box-shadow: 0 0 5px rgba(74, 138, 74, 0.5);
        }

        /* Placeholder Styling */
        input[type="text"]::placeholder {
          color: #888; /* Gray placeholder */
        }

        /* Input Error State */
        input[type="text"]:invalid:not(:placeholder-shown) {
          border-color: #d32f2f;
          background-color: #ffebee;
        }

        /* Submit Button */
        input[type="submit"] {
          background: #4a8a4a; /* Green button */
          border: 2px solid #5aa85a;
          color: #ffffff; /* White text */
          width: 30%;
          display: block;
          margin: 0 auto;
          padding: 10px 20px;
          font-size: 1.8rem;
          font-weight: bold;
          font-family: inherit;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        /* Submit Button Hover */
        input[type="submit"]:hover {
          background: #5aa85a; /* Lighter green */
          border-color: #6ac86a;
        }

        /* Submit Button Focus (Accessibility) */
        input[type="submit"]:focus {
          outline: 2px solid #6ac86a;
          outline-offset: 2px;
        }

        /* Submit Button Disabled */
        input[type="submit"]:disabled {
          background: #999;
          cursor: not-allowed;
        }

        /* Heading */
        h3 {
          font-size: 2.4rem;
          margin-bottom: 1.5rem;
          color: #f5f5f5; /* Very light - excellent visibility */
          text-align: center;
        }

        /* Screen Reader Only Text */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .flex-pair {
            flex-direction: column;
            align-items: flex-start;
            padding: 0 1rem 1rem;
          }

          label {
            text-align: left;
            margin-bottom: 0.5rem;
          }

          input[type="text"] {
            margin-left: 0;
            width: 100%;
          }

          input[type="submit"] {
            width: 100%;
          }
        }
      </style>
    `;
  }

  /**
   * Returns the HTML template for the component
   */
  private getTemplate(): string {
    return `
      <div class="comment-form-container">
        <h3>Add comment</h3>

        <form id="comment-form" class="comment-form" novalidate>
          <div class="flex-pair">
            <label for="name">Your name:</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autocomplete="name"
              placeholder="Enter your name"
              aria-required="true"
            />
          </div>

          <div class="flex-pair">
            <label for="comment">Your comment:</label>
            <input
              id="comment"
              name="comment"
              type="text"
              required
              autocomplete="off"
              placeholder="Enter your comment"
              aria-required="true"
            />
          </div>

          <input type="submit" value="Add comment" />
        </form>
      </div>
    `;
  }

  /**
   * Sets up form submission event listener
   */
  private setupEventListeners(): void {
    if (!this.form) return;

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Handles form submission
   * Validates inputs and dispatches custom event with comment data
   */
  private handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.nameInput || !this.commentInput) return;

    const name = this.nameInput.value.trim();
    const comment = this.commentInput.value.trim();

    // Validation
    if (!name || !comment) {
      alert('Please fill in both name and comment fields.');
      return;
    }

    // Create comment data
    const commentData = {
      name,
      comment,
      timestamp: new Date().toISOString(),
    };

    // Dispatch custom event to parent
    this.dispatchEvent(
      new CustomEvent('comment-added', {
        detail: commentData,
        bubbles: true, // Allow event to bubble up through Shadow DOM boundary
        composed: true, // Allow event to cross Shadow DOM boundary
      })
    );

    // Reset form
    this.form?.reset();

    // Optional: Focus back to name input for next comment
    this.nameInput?.focus();
  }

  /**
   * Called when element is connected to DOM
   */
  connectedCallback(): void {
    // Optional: Add any initialization logic here
    console.log('CommentForm component mounted');
  }

  /**
   * Called when element is disconnected from DOM
   */
  disconnectedCallback(): void {
    // Cleanup if needed
    console.log('CommentForm component unmounted');
  }
}

// Define the custom element
// This registers <comment-form> as a valid HTML element
customElements.define('comment-form', CommentForm);
