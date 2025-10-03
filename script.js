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
    const selectors = '.hero-content h1, .hero-content p';
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

    // ===== 新しいアニメーション機能 =====
    
    // 1. 文字の順次表示（Staggered Animation）
    function initStaggerText() {
        const staggerElements = document.querySelectorAll('[data-stagger]');
        staggerElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            // 単語ごとに分割
            const words = text.split(' ');
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.className = 'stagger-text';
                span.textContent = word + (index < words.length - 1 ? ' ' : '');
                element.appendChild(span);
            });
        });
    }

    // 2. パララックス効果
    function initParallax() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        
        window.addEventListener('scroll', () => {
            parallaxSections.forEach(section => {
                const scrolled = window.pageYOffset;
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrolled;
                const parallaxBg = section.querySelector('.parallax-bg');
                
                if (parallaxBg) {
                    const offset = (scrolled - sectionTop) * 0.5;
                    parallaxBg.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }

    // 3. エレガントフェード監視
    function initElegantFade() {
        const elegantElements = document.querySelectorAll('.elegant-fade');
        
        const elegantObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    console.log('Elegant fade triggered for:', entry.target);
                    elegantObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5, // 要素の50%が表示されたらトリガー
            rootMargin: '0px'
        });

        elegantElements.forEach(el => elegantObserver.observe(el));
    }

    // 4. スケール＆ブラー効果
    function initScaleBlur() {
        const scaleBlurElements = document.querySelectorAll('.scale-blur');
        
        const scaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    console.log('Scale blur triggered for:', entry.target);
                    scaleObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5, // 要素の50%が表示されたらトリガー
            rootMargin: '0px'
        });

        scaleBlurElements.forEach(el => scaleObserver.observe(el));
    }

    // 5. ページロード時にゴールドシャインを一度だけ実行
    function triggerInitialGoldShine() {
        const goldElements = document.querySelectorAll('.gold-shine, .gold-shine-element');
        goldElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    // 6. スクロール連動の中央要素拡大（1つだけハイライト）
    function initScrollZoom() {
        const featureItems = document.querySelectorAll('.features-section .feature-item');
        
        if (featureItems.length === 0) return;
        
        function updateScaleOnScroll() {
            const viewportCenter = window.innerHeight / 2;
            let closestItem = null;
            let minDistance = Infinity;
            
            // まず最も中央に近い要素を見つける
            featureItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.top + rect.height / 2;
                const distanceFromCenter = Math.abs(viewportCenter - itemCenter);
                
                if (distanceFromCenter < minDistance) {
                    minDistance = distanceFromCenter;
                    closestItem = item;
                }
            });
            
            // すべての要素を更新（中央の1つだけを拡大・光らせる）
            featureItems.forEach(item => {
                const isCenterItem = item === closestItem;
                
                if (isCenterItem) {
                    // 中央の要素だけ拡大して光らせる
                    item.style.transform = 'scale(1.1)';
                    item.style.opacity = '1';
                    item.style.boxShadow = '0 30px 80px rgba(212, 175, 55, 0.5), 0 15px 40px rgba(212, 175, 55, 0.3)';
                    item.style.zIndex = '10';
                } else {
                    // その他の要素は通常サイズで影を消す
                    item.style.transform = 'scale(1)';
                    item.style.opacity = '0.7';
                    item.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.07)';
                    item.style.zIndex = '1';
                }
                
                item.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, box-shadow 0.4s ease';
            });
        }
        
        // スクロール時に更新
        window.addEventListener('scroll', updateScaleOnScroll);
        // 初期表示時にも実行
        updateScaleOnScroll();
    }

    // 7. ミッションテキストの順次表示
    function initMissionTextAnimation() {
        const missionSection = document.querySelector('.mission-section');
        const missionTextLines = document.querySelectorAll('.mission-text-line');
        
        console.log('Mission animation init:', {
            section: missionSection,
            lines: missionTextLines.length
        });
        
        if (!missionSection || missionTextLines.length === 0) {
            console.error('Mission section or lines not found!');
            return;
        }
        
        // 初期状態を確実に非表示にする
        missionTextLines.forEach((line, index) => {
            line.classList.remove('visible');
            line.style.opacity = '0';
            line.style.visibility = 'hidden';
            line.style.transform = 'translateY(20px)';
            console.log(`Line ${index + 1} initialized as hidden`);
        });
        
        let hasTriggered = false;
        let timeouts = []; // タイムアウトを保存
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log('Mission section visibility changed:', entry.isIntersecting, 'intersectionRatio:', entry.intersectionRatio);
                
                // セクションが50%以上表示されたらアニメーション開始
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasTriggered) {
                    hasTriggered = true;
                    console.log('Mission section entered - starting sequential animation');
                    
                    // 各行を確実に1.4秒間隔で順番に表示
                    missionTextLines.forEach((line, index) => {
                        const delay = index * 1000; // 1.4秒（1400ms）ずつずらす
                        const timeout = setTimeout(() => {
                            // inlineスタイルを削除してCSSトランジションを有効にする
                            line.style.opacity = '';
                            line.style.visibility = '';
                            line.style.transform = '';
                            // リフローを強制
                            void line.offsetWidth; 
                            line.classList.add('visible');
                            console.log(`✅ Line ${index + 1} of ${missionTextLines.length} displayed after ${delay / 1000} seconds`);
                        }, delay);
                        
                        timeouts.push(timeout);
                        console.log(`⏱️ Scheduled line ${index + 1} to appear in ${delay / 1000} seconds`);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // 複数の閾値を設定
            rootMargin: '0px' // マージンなし
        });
        
        observer.observe(missionSection);
        
        // クリーンアップ関数
        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }

// 8. カルーセルアニメーション
function initImageCarousel() {
    const carousel = document.querySelector('.image-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentSlide = 0;
    let autoSlideInterval;
    
    // スライド切り替え関数
    function showSlide(index) {
        console.log(`Switching to slide ${index}`);
        
        // 全てのスライドを非アクティブに
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            console.log(`Slide ${i} deactivated`);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
            console.log(`Indicator ${i} deactivated`);
        });
        
        // 指定されたスライドをアクティブに
        if (slides[index]) {
            slides[index].classList.add('active');
            console.log(`Slide ${index} activated`);
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
            console.log(`Indicator ${index} activated`);
        }
        
        currentSlide = index;
    }
    
    // 次のスライドに移動
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // 自動スライド開始
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // 3秒間隔
    }
    
    // 自動スライド停止
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // インジケータークリックイベント
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide(); // 再開
        });
    });
    
    // マウスホバーで自動スライド停止
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // 初期化
    showSlide(0);
    startAutoSlide();
    
    // デバッグ用：コンソールにログを出力
    console.log('Carousel initialized:', {
        slides: slides.length,
        indicators: indicators.length,
        currentSlide: currentSlide
    });
    
    // 各スライドの状態を確認
    slides.forEach((slide, index) => {
        console.log(`Slide ${index}:`, {
            hasActiveClass: slide.classList.contains('active'),
            display: getComputedStyle(slide).display,
            opacity: getComputedStyle(slide).opacity
        });
    });
    
    // クリーンアップ関数
    return () => {
        stopAutoSlide();
    };
}

    // すべての高度なアニメーションを初期化
    setTimeout(() => {
        initStaggerText();
        initParallax();
        initElegantFade();
        initScaleBlur();
        triggerInitialGoldShine();
        initScrollZoom();
        initMissionTextAnimation();
        initImageCarousel();
    }, 100);
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
