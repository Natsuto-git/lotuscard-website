// Simple header functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add any future header functionality here
    console.log('Header loaded successfully');
    
    // ページ読み込み時にヒーローセクションにスクロール
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ページリロード時にヒーローセクションに戻る
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// ページが完全に読み込まれた後にヒーローセクションにスクロール
window.addEventListener('load', function() {
    setTimeout(function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 100);
});

// -----------------------------
// Animation helpers
// -----------------------------
document.addEventListener('DOMContentLoaded', function() {
    // IntersectionObserver for reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once visible, unobserve to reduce work
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    // Reveal targets
    document.querySelectorAll('.reveal-up, .card-number-badge, .faq-cta-card').forEach(el => {
        observer.observe(el);
    });

    // Mission lines: apply staggered delays
    const missionParagraphs = document.querySelectorAll('.mission-section p');
    missionParagraphs.forEach((p, idx) => {
        p.classList.add('reveal-up');
        p.style.transitionDelay = `${Math.min(idx * 80, 600)}ms`;
        observer.observe(p);
    });

    // Hero content: initial reveal (title, subtitle, buttons)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.querySelectorAll('h1, p, a').forEach((el, idx) => {
            el.classList.add('reveal-up');
            el.style.transitionDelay = `${idx * 80}ms`;
            // Use a micro timeout to ensure CSS applied before class
            requestAnimationFrame(() => {
                el.classList.add('is-visible');
            });
        });
    }

    // Features cards: add reveal class
    document.querySelectorAll('.features-section .feature-item, .about-features-section .feature-card').forEach((card, i) => {
        card.classList.add('reveal-up');
        card.style.transitionDelay = `${Math.min(i * 70, 560)}ms`;
        observer.observe(card);
    });

    // Badges in About features (1-3)
    document.querySelectorAll('.card-number-badge').forEach(badge => {
        observer.observe(badge);
    });
});

// Parallax for hero background (subtle)
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const y = window.scrollY;
    // Move background at 3% of scroll amount
    hero.style.backgroundPosition = `center calc(50% + ${y * 0.03}px)`;
});

// トップに戻るボタンの機能
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // スクロール位置に応じてボタンの表示/非表示を切り替え
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // ボタンクリック時にヒーローセクションにスムーズスクロール
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});