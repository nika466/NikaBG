// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const fxToggle = document.getElementById('fxToggle');
const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const yearSpan = document.getElementById('year');
const nums = document.querySelectorAll('.num');
const fades = document.querySelectorAll('.fade');

// Particles
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray = [];
let fxEnabled = true;
let animationId = null;

// Добавь этот код в начало существующего script.js

// ========== SIMPLE VPN WARNING ==========
function setupVPNWarning() {
    const vpnWarning = document.getElementById('vpnWarning');
    const closeButton = document.getElementById('closeWarning');
    
    // Проверяем, не закрывал ли пользователь предупреждение ранее
    const warningClosed = localStorage.getItem('vpnWarningClosed');
    
    if (warningClosed === 'true') {
        vpnWarning.style.display = 'none';
        // Возвращаем навигацию на место
        document.querySelector('.nav').style.top = '0';
        document.querySelector('.hero').style.paddingTop = '80px';
    } else {
        // Показываем баннер
        vpnWarning.style.display = 'flex';
    }
    
    // Обработчик закрытия
    closeButton.addEventListener('click', () => {
        // Анимация скрытия
        vpnWarning.style.animation = 'slideUp 0.5s ease';
        vpnWarning.style.opacity = '0';
        
        setTimeout(() => {
            vpnWarning.style.display = 'none';
            // Возвращаем навигацию на место
            document.querySelector('.nav').style.top = '0';
            document.querySelector('.hero').style.paddingTop = '80px';
            
            // Сохраняем в localStorage
            localStorage.setItem('vpnWarningClosed', 'true');
        }, 500);
    });
}

// Добавь анимацию скрытия
const slideUpAnimation = `
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
`;

// Добавляем стиль для анимации
const style = document.createElement('style');
style.textContent = slideUpAnimation;
document.head.appendChild(style);

// В функции init() добавь вызов setupVPNWarning()
function init() {
    // ... существующий код ...
    
    // Настройка VPN предупреждения
    setupVPNWarning();
    
    // ... остальной код ...
}

// Initialize
function init() {
    // Set current year
    yearSpan.textContent = new Date().getFullYear();
    
    // Setup canvas and particles
    setupCanvas();
    createParticles();
    
    // Start animations
    animateNumbers();
    setupScrollAnimations();
    setupEventListeners();
    
    // Start animation loop
    animate();
}

// ========== PARTICLES BACKGROUND ==========
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    });
}

function createParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(100, (canvas.width * canvas.height) / 10000);
    
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            color: i % 2 === 0 ? 'rgba(0, 243, 255, 0.5)' : 'rgba(255, 0, 255, 0.5)'
        });
    }
}

function animate() {
    if (!fxEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationId = requestAnimationFrame(animate);
        return;
    }
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(10, 10, 15, 0.1)');
    gradient.addColorStop(1, 'rgba(26, 26, 46, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let particle of particlesArray) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
        if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Connect particles
        for (let otherParticle of particlesArray) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(138, 43, 226, ${0.2 * (1 - distance/100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        }
    }
    
    animationId = requestAnimationFrame(animate);
}

// ========== THEME TOGGLE ==========
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', newTheme);
    });
    
    // FX toggle
    fxToggle.addEventListener('click', () => {
        fxEnabled = !fxEnabled;
        canvas.style.opacity = fxEnabled ? '1' : '0';
        fxToggle.textContent = fxEnabled ? '✨' : '🚫';
        localStorage.setItem('fx', fxEnabled);
        
        if (fxEnabled && !animationId) {
            animate();
        }
    });
    
    // Mobile menu
    menuToggle.addEventListener('click', () => {
        drawer.setAttribute('aria-hidden', 'false');
        drawer.classList.toggle('open');
        menuToggle.innerHTML = drawer.classList.contains('open') ? '✕' : '☰';
    });
    
    // Close drawer when clicking links
    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            drawer.setAttribute('aria-hidden', 'true');
            drawer.classList.remove('open');
            menuToggle.innerHTML = '☰';
        });
    });
    
    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !menuToggle.contains(e.target) && drawer.classList.contains('open')) {
            drawer.setAttribute('aria-hidden', 'true');
            drawer.classList.remove('open');
            menuToggle.innerHTML = '☰';
        }
    });
    
    // Poll functionality
    const pollOptions = document.querySelectorAll('.poll-option');
    const pollResults = document.querySelector('.poll-results');
    let pollVotes = { Bedwars: 0, SkyBlock: 0, Roblox: 0 };
    let hasVoted = localStorage.getItem('hasVoted');
    
    if (!hasVoted) {
        pollOptions.forEach(option => {
            option.addEventListener('click', handleVote);
        });
    } else {
        showPollResults();
    }
    
    function handleVote(e) {
        const choice = e.target.dataset.option;
        pollVotes[choice]++;
        
        // Save vote
        localStorage.setItem('pollVotes', JSON.stringify(pollVotes));
        localStorage.setItem('hasVoted', 'true');
        
        // Remove event listeners
        pollOptions.forEach(option => {
            option.removeEventListener('click', handleVote);
            option.style.cursor = 'default';
        });
        
        // Show results
        showPollResults();
    }
    
    function showPollResults() {
        const savedVotes = localStorage.getItem('pollVotes');
        if (savedVotes) {
            pollVotes = JSON.parse(savedVotes);
        }
        
        let totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);
        let resultsHTML = '<div class="poll-results-content">';
        
        for (const [game, votes] of Object.entries(pollVotes)) {
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            resultsHTML += `
                <div class="poll-result">
                    <span class="poll-game">${game}</span>
                    <div class="poll-bar-container">
                        <div class="poll-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="poll-percentage">${percentage}% (${votes})</span>
                </div>
            `;
        }
        
        resultsHTML += '</div>';
        pollResults.innerHTML = resultsHTML;
        
        // Add CSS for poll bars
        const style = document.createElement('style');
        style.textContent = `
            .poll-results-content {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .poll-result {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 0.9rem;
            }
            .poll-bar-container {
                flex: 1;
                height: 8px;
                background: var(--border);
                border-radius: 4px;
                overflow: hidden;
            }
            .poll-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
                border-radius: 4px;
                transition: width 1s ease;
            }
            .poll-game {
                min-width: 80px;
                text-align: left;
            }
            .poll-percentage {
                min-width: 80px;
                text-align: right;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fan messages rotation
    const fanMessages = [
        { name: "Alex Gamer", quote: "Nika's videos are insane! Learned so much from him.", avatar: 0 },
        { name: "Pro Player", quote: "Best blockmango content on YouTube!", avatar: 1 },
        { name: "Super Fan", quote: "The community is amazing, thanks Nika!", avatar: 2 },
        { name: "Gaming Buddy", quote: "Can't wait for the next livestream!", avatar: 3 }
    ];
    
    let currentMessage = 0;
    const fanMessagesContainer = document.getElementById('fanMessages');
    
    if (fanMessagesContainer) {
        // Initial message
        updateFanMessage();
        
        // Rotate every 5 seconds
        setInterval(() => {
            currentMessage = (currentMessage + 1) % fanMessages.length;
            updateFanMessage();
        }, 5000);
    }
    
    function updateFanMessage() {
        const fan = fanMessages[currentMessage];
        fanMessagesContainer.innerHTML = `
            <div class="fan-message">
                <img src="https://cdn.discordapp.com/embed/avatars/${fan.avatar}.png" 
                     alt="${fan.name}" 
                     class="fan-avatar">
                <div class="fan-text">
                    <h4 class="fan-name">${fan.name}</h4>
                    <p class="fan-quote">"${fan.quote}"</p>
                </div>
            </div>
        `;
        
        // Add fade animation
        fanMessagesContainer.style.opacity = '0';
        setTimeout(() => {
            fanMessagesContainer.style.transition = 'opacity 0.5s ease';
            fanMessagesContainer.style.opacity = '1';
        }, 10);
    }
}

// ========== ANIMATE NUMBERS ==========
function animateNumbers() {
    nums.forEach(num => {
        const target = parseInt(num.dataset.target);
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            num.textContent = Math.floor(current).toLocaleString();
        }, 30);
    });
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    fades.forEach(fade => observer.observe(fade));
}

// ========== LOAD SAVED PREFERENCES ==========
function loadPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Load FX preference
    const savedFX = localStorage.getItem('fx');
    if (savedFX !== null) {
        fxEnabled = savedFX === 'true';
        canvas.style.opacity = fxEnabled ? '1' : '0';
        fxToggle.textContent = fxEnabled ? '✨' : '🚫';
    }
}

// ========== START EVERYTHING ==========
window.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});