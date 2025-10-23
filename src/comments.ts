// Comments functionality module with TypeScript types

interface CommentElements {
  toggleBtn: HTMLButtonElement;
  wrapper: HTMLElement;
  form: HTMLFormElement | HTMLElement; // Can be form or web component
  list: HTMLElement;
}

interface CommentData {
  name: string;
  comment: string;
  timestamp?: string;
}

export function initComments({
  toggleBtn,
  wrapper,
  form,
  list,
}: CommentElements): void {
  console.log('Initializing comments module...');

  // Prüfe ob alle Elemente existieren
  if (!toggleBtn || !wrapper || !form || !list) {
    console.error('Comments: Required elements not found', {
      toggleBtn: !!toggleBtn,
      wrapper: !!wrapper,
      form: !!form,
      list: !!list,
    });
    return;
  }

  try {
    // Initialzustand - verstecke Kommentare
    wrapper.style.display = 'none';
    toggleBtn.textContent = 'Show comment';

    // Toggle-Funktionalität
    toggleBtn.addEventListener('click', (): void => {
      try {
        if (wrapper.style.display === 'none') {
          wrapper.style.display = 'block';
          toggleBtn.textContent = 'Hide comments';
          toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
          wrapper.style.display = 'none';
          toggleBtn.textContent = 'Show comment';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      } catch (error: unknown) {
        console.error('Toggle comments failed:', error);
        alert('Could not toggle comments section.');
      }
    });

    // Tastatur-Support für Toggle-Button
    toggleBtn.addEventListener('keydown', (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });

    // Check if form is a Web Component or traditional form
    if (form.tagName.toLowerCase() === 'comment-form') {
      // Web Component - Listen for custom event
      form.addEventListener('comment-added', ((
        e: CustomEvent<CommentData>
      ): void => {
        try {
          const { name, comment } = e.detail;
          addComment(name, comment, list);
          console.log('Comment added from Web Component:', e.detail);
        } catch (error: unknown) {
          console.error('Failed to add comment from Web Component:', error);
          alert('Failed to add comment. Please try again.');
        }
      }) as EventListener);

      console.log('Web Component comment form detected and initialized');
    } else {
      // Traditional form - Original submit handler
      const formElement = form as HTMLFormElement;
      formElement.addEventListener('submit', (e: Event): void => {
        e.preventDefault();

        try {
          const nameInput: HTMLInputElement | null =
            formElement.querySelector('#name');
          const commentInput: HTMLInputElement | null =
            formElement.querySelector('#comment');

          if (!nameInput || !commentInput) {
            console.error('Name or comment input not found');
            return;
          }

          const nameValue: string = nameInput.value.trim();
          const commentValue: string = commentInput.value.trim();

          // Validierung - beide Felder müssen ausgefüllt sein
          if (!nameValue || !commentValue) {
            alert('Both name and comment fields are required!');
            return;
          }

          // Kommentar hinzufügen
          addComment(nameValue, commentValue, list);

          // Formular zurücksetzen
          nameInput.value = '';
          commentInput.value = '';

          console.log('Comment added successfully');
        } catch (error: unknown) {
          console.error('Comment submission failed:', error);
          alert('Failed to submit comment. Please try again.');
        }
      });

      console.log('Traditional comment form detected and initialized');
    }

    console.log('Comments module initialized successfully');
  } catch (error: unknown) {
    console.error('Comments initialization failed:', error);
  }
}

function addComment(name: string, comment: string, list: HTMLElement): void {
  const listItem: HTMLLIElement = document.createElement('li');
  const namePara: HTMLParagraphElement = document.createElement('p');
  const commentPara: HTMLParagraphElement = document.createElement('p');

  namePara.textContent = name;
  commentPara.textContent = comment;

  listItem.appendChild(namePara);
  listItem.appendChild(commentPara);
  list.appendChild(listItem);
}
