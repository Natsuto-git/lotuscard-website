// Simple header functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add any future header functionality here
    console.log('Header loaded successfully');
    
    // ページ読み込み時にヒーローセクションにスクロール
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // フェードイン対象要素と監視者のセットアップ
    const selectors = '.hero-content h1, .hero-content p, .mission-section h2, .mission-section p';
    let fadeTargets = Array.from(document.querySelectorAll(selectors));

    fadeTargets.forEach(function(el) { el.classList.add('fade-in'); el.classList.remove('visible'); });

    let observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

    function observeAll() {
        fadeTargets.forEach(function(el) { observer.observe(el); });
    }
    observeAll();

    // リロード時にもフェードを確実に発火させるための補助
    function isInViewport(el) {
        const r = el.getBoundingClientRect();
        return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
    }

    function resetFade() {
        // 監視を一旦解除
        observer.disconnect();
        // ターゲットを再取得（DOM変化に対応）
        fadeTargets = Array.from(document.querySelectorAll(selectors));
        // クラスを初期状態に戻す
        fadeTargets.forEach(function(el) {
            el.classList.add('fade-in');
            el.classList.remove('visible');
        });
        // 再監視
        observer = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
        observeAll();
    }

    function restartFadeIfVisible() {
        resetFade();
        // 画面内にあるものは即時再生
        fadeTargets.forEach(function(el) {
            if (isInViewport(el)) {
                // reflow を挟んでからvisible付与
                void el.offsetWidth;
                setTimeout(function() { el.classList.add('visible'); }, 50);
            }
        });
    }

    window.addEventListener('load', function() {
        restartFadeIfVisible();
    });

    window.addEventListener('pageshow', function() {
        // bfcache 復帰時にも再発火
        restartFadeIfVisible();
    });

    // 予防的: タブ復帰時にも再生（必要であれば）
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            restartFadeIfVisible();
        }
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