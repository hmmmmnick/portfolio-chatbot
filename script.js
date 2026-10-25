// ============================================================
// 1. LIGHT / DARK MODE TOGGLE (TASK 3)
// ============================================================
const themeToggleBtn = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('ambesh-portfolio-theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('ambesh-portfolio-theme', newTheme);
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// ============================================================
// 2. PROJECT SEARCH AND FILTER (TASK 3)
// ============================================================
const searchInput = document.getElementById('project-search');
const clearSearchBtn = document.getElementById('clear-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const noResultsDiv = document.getElementById('no-results');

let activeFilter = 'all';

function filterProjects() {
  const query = searchInput.value.toLowerCase().trim();
  clearSearchBtn.style.display = query ? 'block' : 'none';

  let visibleCount = 0;

  projectCards.forEach(card => {
    const cardTitle = card.querySelector('.project-title').textContent.toLowerCase();
    const cardDesc = card.querySelector('.project-description').textContent.toLowerCase();
    const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
    const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();

    // Check category filter
    const matchesFilter = (activeFilter === 'all') || cardCategory.includes(activeFilter);

    // Check search input against title, description, and keywords
    const matchesSearch = !query || 
      cardTitle.includes(query) || 
      cardDesc.includes(query) || 
      cardKeywords.includes(query);

    if (matchesFilter && matchesSearch) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (visibleCount === 0) {
    noResultsDiv.classList.remove('hidden');
  } else {
    noResultsDiv.classList.add('hidden');
  }
}

searchInput.addEventListener('input', filterProjects);

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  filterProjects();
  searchInput.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter');
    filterProjects();
  });
});

// ============================================================
// 3. AI CHATBOT CONTROLLER (TASK 6)
// ============================================================
const chatbotLauncher = document.getElementById('chatbot-toggle-btn');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
const chatbotWindow = document.getElementById('chatbot-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const openChatNav = document.getElementById('open-chat-nav');
const heroChatTrigger = document.getElementById('hero-chat-trigger');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

function toggleChat(open = null) {
  const isOpen = !chatbotWindow.classList.contains('hidden');
  const targetState = open !== null ? open : !isOpen;

  if (targetState) {
    chatbotWindow.classList.remove('hidden');
    chatInput.focus();
  } else {
    chatbotWindow.classList.add('hidden');
  }
}

chatbotLauncher.addEventListener('click', () => toggleChat());
chatbotCloseBtn.addEventListener('click', () => toggleChat(false));
if (openChatNav) openChatNav.addEventListener('click', () => toggleChat(true));
if (heroChatTrigger) heroChatTrigger.addEventListener('click', () => toggleChat(true));

suggestionChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const prompt = chip.getAttribute('data-prompt');
    chatInput.value = prompt;
    chatForm.dispatchEvent(new Event('submit'));
  });
});

function appendBubble(text, sender = 'bot', isError = false) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}-bubble ${isError ? 'error-bubble' : ''}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Render User Message
  appendBubble(userText, 'user');
  chatInput.value = '';

  // Render Temporary Thinking Bubble
  const loadingBubble = appendBubble('Thinking...', 'bot');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch response from API');
    }

    loadingBubble.textContent = data.reply;
  } catch (err) {
    console.error('Chatbot API Error:', err);
    loadingBubble.className = 'chat-bubble bot-bubble error-bubble';
    loadingBubble.textContent = `Error: ${err.message || 'Unable to connect to AI server. Please verify network or API keys.'}`;
  }
});