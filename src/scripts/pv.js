// DOM Elements
const elements = {
    addButton: document.getElementById('addPassword'),
    passwordList: document.getElementById('passwordList'),
    modal: document.getElementById('passwordModal'),
    form: document.getElementById('passwordForm'),
    cancelButton: document.getElementById('cancelAdd'),
    togglePasswordButtons: document.querySelectorAll('.toggle-password')
  };
  
  // State management
  let passwords = [];
  
  // Load passwords from storage
  const loadPasswords = async () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const data = await chrome.storage.local.get('passwords');
      passwords = data.passwords || [];
      renderPasswords();
    }
  };
  
  // Save passwords to storage
  const savePasswords = async () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ passwords });
    }
  };
  
  // Render password list
  const renderPasswords = () => {
    elements.passwordList.innerHTML = '';
    
    passwords.forEach((item, index) => {
      const passwordItem = document.createElement('div');
      passwordItem.className = 'password-item';
      passwordItem.innerHTML = `
        <div class="password-header">
          <h3 class="password-title">${item.title}</h3>
          <div class="password-actions">
            <button class="action-button copy-password" data-index="${index}" aria-label="Copy password">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </button>
            <button class="action-button delete-password" data-index="${index}" aria-label="Delete password">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="password-details">
          <div class="detail-row">
            <span class="detail-label">Username:</span>
            <span>${item.username}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Password:</span>
            <span>••••••••</span>
          </div>
        </div>
      `;
  
      elements.passwordList.appendChild(passwordItem);
    });
  
    // Add event listeners for copy and delete buttons
    document.querySelectorAll('.copy-password').forEach(button => {
      button.addEventListener('click', async (e) => {
        const index = e.currentTarget.dataset.index;
        const password = passwords[index].password;
        
        try {
          await navigator.clipboard.writeText(password);
          showNotification('Password copied to clipboard');
        } catch (error) {
          showNotification('Failed to copy password', true);
        }
      });
    });
  
    document.querySelectorAll('.delete-password').forEach(button => {
      button.addEventListener('click', async (e) => {
        const index = e.currentTarget.dataset.index;
        passwords.splice(index, 1);
        await savePasswords();
        renderPasswords();
        showNotification('Password deleted');
      });
    });
  };
  
  // Show notification
  const showNotification = (message, isError = false) => {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };
  
  // Toggle password visibility
  elements.togglePasswordButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const input = e.currentTarget.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      
      // Update icon
      const svg = e.currentTarget.querySelector('svg');
      if (type === 'password') {
        svg.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
      } else {
        svg.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>';
      }
    });
  });
  
  // Event Listeners
  elements.addButton.addEventListener('click', () => {
    elements.modal.style.display = 'flex';
  });
  
  elements.cancelButton.addEventListener('click', () => {
    elements.modal.style.display = 'none';
    elements.form.reset();
  });
  
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = {
      title: e.target.title.value,
      username: e.target.username.value,
      password: e.target.password.value
    };
  
    passwords.push(newPassword);
    await savePasswords();
    renderPasswords();
  
    elements.modal.style.display = 'none';
    elements.form.reset();
    showNotification('Password saved successfully');
  });
  
  // Initialize
  loadPasswords();