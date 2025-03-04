document.getElementById('returnButton').addEventListener('click', function() {
    window.location.href = '../index.html';
});

// DOM Elements
const elements = {
    addButton: document.getElementById('addPassword'),
    passwordList: document.getElementById('passwordList'),
    modal: document.getElementById('passwordModal'),
    form: document.getElementById('passwordForm'),
    cancelButton: document.getElementById('cancelAdd'),
    togglePasswordButtons: document.querySelectorAll('.toggle-password'),
    detailModal: document.getElementById('passwordDetailModal'),
    closeDetailButton: document.getElementById('closeDetail'),
    detailTitle: document.getElementById('detailTitle'),
    detailUsername: document.getElementById('detailUsername'),
    detailPassword: document.getElementById('detailPassword')
};

// State management
let passwords = [];

// Load passwords from storage
const loadPasswords = async () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get('passwords', (data) => {
            passwords = data.passwords || [];
            renderPasswords();
        });
    }
};

// Save passwords to storage
const savePasswords = async () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ passwords });
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
                <h3 class="password-title" title="${item.title}">${item.title}</h3>
                <div class="password-actions">
                    <button class="action-button delete-password" data-index="${index}" aria-label="Delete password">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                    </button>
                    <button class="action-button detail-button" data-index="${index}" aria-label="View details">
                        <img src="../resources/details.svg" alt="Details" width="10" height="10">
                    </button>
                </div>
            </div>
            <div class="password-details">
                <div class="detail-row">
                    <span class="detail-label">Username:</span>
                    <span id="username-${index}" class="password-username">${item.username}</span>
                    <button class="copy-button" data-copy-target="username-${index}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg></button>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Password:</span>
                    <span id="password-${index}" class="hidden-password password-password">••••••••</span>
                    <button class="copy-button" data-copy-target="password-${index}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg></button>
                </div>
            </div>
        `;
  
        elements.passwordList.appendChild(passwordItem);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-password').forEach(button => {
        button.addEventListener('click', async (e) => {
            const index = e.currentTarget.dataset.index;
            passwords.splice(index, 1);
            await savePasswords();
            renderPasswords();
            showNotification('Password deleted');
        });
    });

    // Add event listeners for copy buttons
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const targetId = e.currentTarget.dataset.copyTarget;
            const textToCopy = document.getElementById(targetId).innerText;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showNotification('Copied to clipboard');
            } catch (error) {
                showNotification('Failed to copy', true);
            }
        });
    });

    // Add event listeners for detail buttons
    document.querySelectorAll('.detail-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            const password = passwords[index];
            elements.detailTitle.textContent = password.title;
            elements.detailUsername.textContent = password.username;
            elements.detailPassword.textContent = password.password;
            elements.detailModal.style.display = 'flex';
        });
    });

    // Add event listeners for toggle password visibility buttons
    document.querySelectorAll('.toggle-password-visibility').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement.classList.contains('hidden-password')) {
                targetElement.classList.remove('hidden-password');
                targetElement.textContent = passwords[targetId.split('-')[1]].password;
                e.currentTarget.textContent = 'Hide';
            } else {
                targetElement.classList.add('hidden-password');
                targetElement.textContent = '••••••••';
                e.currentTarget.textContent = 'Show';
            }
        });
    });
};

// Show notification
const showNotification = (message, isError = false) => {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    document.querySelector('.container').appendChild(notification);

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
        const img = e.currentTarget.querySelector('img');
        if (type === 'password') {
            img.src = "../resources/eyeicon.svg"; // Path to eye-open SVG
        } else {
            img.src = "../resources/eyecloseicon.svg"; // Path to eye-closed SVG
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

elements.closeDetailButton.addEventListener('click', () => {
    elements.detailModal.style.display = 'none';
});

// Initial load
loadPasswords();