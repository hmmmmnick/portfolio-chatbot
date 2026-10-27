// ============================================================
// 1. SCROLL PROGRESS BAR & ACTIVE NAV HIGHLIGHT
// ============================================================
const progressBar = document.getElementById('scroll-progress');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  // Update progress bar
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + '%';

  // Active navigation highlight based on scroll position
  let currentSectionId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (winScroll >= sectionTop) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
});

// ============================================================
// 2. SCROLL REVEAL OBSERVER (INTERSECTION OBSERVER)
// ============================================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  },
  {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));

// ============================================================
// 3. LIGHT / DARK MODE TOGGLE (TASK 3)
// ============================================================
const themeToggleBtn = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('ambesh-portfolio-theme') || 
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'); // default dark for high-tech aesthetic

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
if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });
}

// ============================================================
// 4. PROJECT SEARCH AND FILTER (TASK 3)
// ============================================================
const searchInput = document.getElementById('project-search');
const clearSearchBtn = document.getElementById('clear-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const noResultsDiv = document.getElementById('no-results');

let activeFilter = 'all';

function filterProjects() {
  const query = searchInput.value.toLowerCase().trim();
  if (clearSearchBtn) clearSearchBtn.style.display = query ? 'block' : 'none';

  let visibleCount = 0;

  projectCards.forEach(card => {
    const cardTitle = card.querySelector('.project-title').textContent.toLowerCase();
    const cardDesc = card.querySelector('.project-description').textContent.toLowerCase();
    const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
    const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();

    const matchesFilter = (activeFilter === 'all') || cardCategory.includes(activeFilter);
    const matchesSearch = !query || 
      cardTitle.includes(query) || 
      cardDesc.includes(query) || 
      cardKeywords.includes(query);

    if (matchesFilter && matchesSearch) {
      card.classList.remove('hidden');
      card.classList.add('active'); // trigger reveal
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (noResultsDiv) {
    if (visibleCount === 0) {
      noResultsDiv.classList.remove('hidden');
    } else {
      noResultsDiv.classList.add('hidden');
    }
  }
}

if (searchInput) searchInput.addEventListener('input', filterProjects);

if (clearSearchBtn) {
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterProjects();
    searchInput.focus();
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter');
    filterProjects();
  });
});

// ============================================================
// 5. AI CHATBOT CONTROLLER (TASK 6)
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

if (chatbotLauncher) chatbotLauncher.addEventListener('click', () => toggleChat());
if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', () => toggleChat(false));
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

// Local Grounded Knowledge Base (Fallback for instant offline response)
function getLocalGroundedAnswer(query) {
  const q = query.toLowerCase();

  if (q.includes('who are you') || q.includes('about') || q.includes('introduce')) {
    return "I am Ambesh Mishra's personal portfolio AI assistant. Ambesh is a B.Tech Computer Science student specializing in Artificial Intelligence & Machine Learning at JECRC University, Jaipur.";
  }
  if (q.includes('skill') || q.includes('technolog') || q.includes('stack')) {
    return "Ambesh is proficient in Python, JavaScript, HTML5/CSS3, SQL, Cursor AI, Git/GitHub, Vercel deployment, REST APIs, and Machine Learning foundations.";
  }
  if (q.includes('project') || q.includes('completed')) {
    return "Ambesh has completed 5 core projects: 1) Python Programs Collection, 2) Messy Python Code Improvement, 3) Bug Fixing Using Cursor AI, 4) Interactive Quiz Application (Lecture 10), and 5) Book Reading List Application (Lecture 11).";
  }
  if (q.includes('python program') || q.includes('factorial') || q.includes('fibonacci')) {
    return "The Python Programs Collection features core algorithms: recursive/iterative Factorial, Fibonacci series generation, and Structure-to-Dictionary data serialization.";
  }
  if (q.includes('bug') || q.includes('cursor') || q.includes('corrected')) {
    return "In the Bug Fixing project (Lecture 8), Ambesh used Cursor AI to perform root-cause analysis on an intentionally buggy codebase, resolving boundary conditions, division by zero, and grade sorting logic with 9 passing unit tests.";
  }
  if (q.includes('reading') || q.includes('book')) {
    return "The Book Reading List Application (Lecture 11) is a responsive book manager with local storage persistence, book categorization, and reading progress filtering.";
  }
  if (q.includes('github')) {
    return "You can explore all of Ambesh's projects on his GitHub profile at https://github.com/hmmmmnick.";
  }

  return "I am Ambesh Mishra's portfolio assistant. You can ask me about his B.Tech studies at JECRC University, his technical skills, his 5 projects, or his GitHub repositories!";
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Render User Message
  appendBubble(userText, 'user');
  chatInput.value = '';

  // Render Thinking Bubble
  const loadingBubble = appendBubble('Thinking...', 'bot');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    if (response.ok) {
      const data = await response.json();
      loadingBubble.textContent = data.reply;
      return;
    }
    
    throw new Error('Local environment detected');
  } catch (err) {
    // Seamless grounded fallback
    setTimeout(() => {
      loadingBubble.textContent = getLocalGroundedAnswer(userText);
    }, 350);
  }
});