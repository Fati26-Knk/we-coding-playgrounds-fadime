// Comments functionality module
export function initComments({ toggleBtn, wrapper, form, list }) {
  console.log('Initializing comments module...');
  
  // Prüfe ob alle Elemente existieren
  if (!toggleBtn || !wrapper || !form || !list) {
    console.error('Comments: Required elements not found', { 
      toggleBtn: !!toggleBtn, 
      wrapper: !!wrapper, 
      form: !!form, 
      list: !!list 
    });
    return;
  }

  try {
    // Initialzustand - verstecke Kommentare
    wrapper.style.display = 'none';
    toggleBtn.textContent = 'Show comment';

    // Toggle-Funktionalität
    toggleBtn.addEventListener('click', () => {
      try {
        if (wrapper.style.display === 'none') {
          wrapper.style.display = 'block';
          toggleBtn.textContent = 'Hide comments';
        } else {
          wrapper.style.display = 'none';
          toggleBtn.textContent = 'Show comment';
        }
      } catch (error) {
        console.error('Toggle comments failed:', error);
        alert('Could not toggle comments section.');
      }
    });

    // Tastatur-Support für Toggle-Button
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      try {
        const nameInput = form.querySelector('#name');
        const commentInput = form.querySelector('#comment');
        
        if (!nameInput || !commentInput) {
          console.error('Name or comment input not found');
          return;
        }
        
        const nameValue = nameInput.value.trim();
        const commentValue = commentInput.value.trim();

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
      } catch (error) {
        console.error('Comment submission failed:', error);
        alert('Failed to submit comment. Please try again.');
      }
    });
    
    console.log('Comments module initialized successfully');
  } catch (error) {
    console.error('Comments initialization failed:', error);
  }
}

function addComment(name, comment, list) {
  const listItem = document.createElement('li');
  const namePara = document.createElement('p');
  const commentPara = document.createElement('p');

  namePara.textContent = name;
  commentPara.textContent = comment;

  listItem.appendChild(namePara);
  listItem.appendChild(commentPara);
  list.appendChild(listItem);
}
