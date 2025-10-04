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
                // モバイルでは70%以上、デスクトップでは50%以上表示されたらアニメーション開始
                const isMobile = window.innerWidth <= 768;
                const requiredRatio = isMobile ? 0.7 : 0.5;
                
                if (entry.isIntersecting && entry.intersectionRatio >= requiredRatio) {
                    entry.target.classList.add('visible');
                    console.log('Elegant fade triggered for:', entry.target);
                    elegantObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // 複数の閾値を設定
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
                
                // モバイルでは70%以上、デスクトップでは50%以上表示されたらアニメーション開始
                const isMobile = window.innerWidth <= 768;
                const requiredRatio = isMobile ? 0.7 : 0.5;
                
                if (entry.isIntersecting && entry.intersectionRatio >= requiredRatio && !hasTriggered) {
                    hasTriggered = true;
                    console.log('Mission section entered - starting sequential animation');
                    
                    // 各行を確実に0.6秒間隔で順番に表示
                    missionTextLines.forEach((line, index) => {
                        const delay = index * 600; // 0.6秒（600ms）ずつずらす
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
            slide.classList.remove('active', 'prev');
        });
        
        // 前のスライドにprevクラスを設定（アニメーション用）
        if (slides[currentSlide] && currentSlide !== index) {
            slides[currentSlide].classList.add('prev');
        }
        
        // インジケーターを更新
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
        });
        
        // 指定されたスライドをアクティブに
        if (slides[index]) {
            // 少し遅延させてアニメーションを確実に実行
            setTimeout(() => {
                slides[index].classList.add('active');
                console.log(`Slide ${index} activated with 3D rotation`);
            }, 50);
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
        autoSlideInterval = setInterval(nextSlide, 4000); // 4秒間隔に延長
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
    
    // タッチ・マウススワイプ機能（デスクトップ・モバイル両対応）
    let startX = 0;
    let endX = 0;
    let isDragging = false;
    
    // タッチイベント（モバイル）
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });
    
    // マウスイベント（デスクトップ）
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        stopAutoSlide();
        e.preventDefault();
    });
    
    carousel.addEventListener('mouseup', (e) => {
        if (isDragging) {
            endX = e.clientX;
            handleSwipe();
            startAutoSlide();
            isDragging = false;
        }
    });
    
    // マウスがカルーセル外に出た場合の処理
    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            startAutoSlide();
        }
    });
    
    // ドラッグ中にマウスが動いた場合の処理（選択を防ぐ）
    carousel.addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // 最小スワイプ距離
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 左スワイプ（次のスライド）
                nextSlide();
            } else {
                // 右スワイプ（前のスライド）
                const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
                showSlide(prevIndex);
            }
        }
    }
    
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

// 9. スムーズスクロール機能
function initSmoothScroll() {
    // 全ての内部リンクにスムーズスクロールを適用
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // ヘッダーの高さを考慮
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                console.log(`Smooth scrolling to: ${targetId}`);
            }
        });
    });
}

// 10. FAQアコーディオン機能
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 他のFAQアイテムを閉じる
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 現在のアイテムをトグル
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
            
            console.log(`FAQ toggled: ${item.querySelector('h3').textContent}`);
        });
    });
}

// 11. モーダル機能
function initModal() {
    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.modal-close-button');
    const modalLinks = document.querySelectorAll('[data-modal]');
    
    // モーダルコンテンツの定義
    const modalContent = {
        company: {
            title: '運営について',
            content: `
                <h3>事業概要</h3>
                <p><strong>事業名:</strong> LotusCard</p>
                <p><strong>共同代表:</strong> 山口 夏翔, 山元 来輝</p>
                <p><strong>創立:</strong> 2025年7月22日</p>
                <p><strong>所在地:</strong> 兵庫県尼崎市常松2-14-47</p>
                <p><strong>事業内容:</strong> デジタル名刺サービスの提供</p>
                
                <h3>お問い合わせ</h3>
                <p>ご質問やお問い合わせがございましたら、以下の方法でお気軽にご連絡ください。</p>
                <ul>
                    <li>メール: lotuscard0722@gmail.com</li>
                </ul>
            `
        },
        privacy: {
            title: 'プライバシーポリシー',
            content: `
                <p>本規約は、LotusCard（以下「当社」といいます。）は、当社がLotusCard（以下「本サービス」といいます。）を提供するにあたり、ご利用される皆様（以下「利用者」といいます。）の個人に関する情報（以下「個人情報」といいます。）を取得します。</p>
                
                <h3>第１条（適用範囲）</h3>
                <p>本プライバシーポリシー（以下「本ポリシー」といいます。）は、当社が利用者から個人情報を取得、利用及び管理するときに適用されます。</p>
                
                <h3>第２条（取得する情報）</h3>
                <p>当社は、利用者から以下の情報を取得します。</p>
                <p>（1）氏名</p>
                <p>（2）住所</p>
                <p>（3）生年月日</p>
                <p>（4）年齢</p>
                <p>（5）連絡先</p>
                <p>（6）クレジットカード情報、銀行口座情報等の決済に関する情報</p>
                
                <h3>第３条（利用目的）</h3>
                <p>当社が個人情報を収集・利用する目的は、以下のとおりです。</p>
                <p>（1）本サービスの提供・運営のため</p>
                <p>（2）本サービスの運営上必要な事項の通知のため</p>
                <p>（3）本サービスに関する新機能、更新情報をお知らせするため</p>
                <p>（4）キャンペーン、懸賞企画、アンケートの実施のため</p>
                <p>（5）本サービスの各種問合せ、アフターサービス対応のため</p>
                <p>（6）本サービスその他のコンテンツの開発・改善のため</p>
                <p>（7）当社が実施するサービス又は企画に関する連絡のため</p>
                <p>（8）上記の利用目的に付随する目的</p>
                
                <h3>第４条（安全確保の措置）</h3>
                <p>当社は、収集した情報の漏えい、滅失又はき損の防止その他収集した情報の適切な管理のために必要な措置を講じます。当社が、安全管理のために講じた措置の概要は以下のとおりです。措置の具体的内容については、本ポリシーで定める窓口に対する利用者からの求めに応じて遅滞なく回答いたします。</p>
                <p>（1）基本方針の策定、個人情報の取扱いに係る規律の整備</p>
                <p>（2）個人情報の取扱責任者や報告連絡体制の整備</p>
                <p>（3）定期的な研修の実施</p>
                <p>（4）個人情報を取り扱うことのできる機器やアクセス権者を明確にし、個人情報への不要なアクセスを防止</p>
                
                <h3>第5条（個人情報の第三者への提供）</h3>
                <p>１　当社は、次に掲げる場合を除いて、あらかじめ利用者の同意を得ないで、取得した個人情報を第三者に提供することはありません。</p>
                <p>（１）法令に基づく場合</p>
                <p>（２）人の生命、身体又は財産の保護のために必要がある場合であって、利用者の同意を得ることが困難であるとき。</p>
                <p>（３）公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、利用者の同意を得ることが困難であるとき。</p>
                <p>（４）国の機関若しくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、利用者の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき。</p>
                <p>（５）その他法令で第三者提供の制限の例外が認められている場合</p>
                <p>２　前項の定めにかかわらず、次に掲げる場合には、当該個人情報の提供先は第三者に該当しないものとします。</p>
                <p>（１）当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部又は一部を委託することに伴って当該個人情報が提供される場合</p>
                <p>（２）合併その他の事由による事業の承継に伴って個人情報が提供される場合</p>
                <p>（３）第7条に定める共同利用者に対して提供される場合</p>
                
                <h3>第６条（個人情報の共同利用）</h3>
                <p>当社は、特定の者との間で共同利用することを目的として個人情報を当該特定の者に提供することがあります。この場合、当社は、あらかじめ、共同して利用する個人情報の項目、共同して利用する者の範囲、利用する者の利用目的及び当該個人情報の管理について責任を有する者の氏名又は名称及び住所並びに法人にあっては、その代表者の氏名を公表するものとします。</p>
                
                <h3>第７条（本プライバシーポリシーの変更）</h3>
                <p>当社は、法令改正への対応の必要性及び事業上の必要性に応じて、本ポリシーを変更する場合があります。本ポリシーの変更を行った場合には、本ウェブサイト上に掲載します。</p>
                
                <h3>第８条（開示、訂正等の手続）</h3>
                <p>１　利用者は、本条及び当社の関連規程に従って、当社に対し、個人情報保護法において認められる限度で、以下の求め又は請求を行うことができます。</p>
                <p>（１）個人情報の利用目的の通知の求め</p>
                <p>（２）個人情報又は第三者提供記録の開示の請求</p>
                <p>（３）個人情報の訂正、追加又は削除の請求</p>
                <p>（４）個人情報の利用の停止の請求</p>
                <p>（５）個人情報の第三者への提供の停止の請求</p>
                <p>２　前項の求め又は請求にあたっては、同項各号のうちいずれの請求か特定の上、本人確認のための書類（運転免許証、健康保険証、住民票の写し等）をご提出頂きます。</p>
                
                <h3>第９条（お問い合わせ）</h3>
                <p>当社の個人情報の取扱いに関するご相談や苦情等のお問い合わせについては、下記の窓口にご連絡ください。個人情報取扱事業者の氏名又は名称、住所及び代表者の氏名については、ウェブサイトの会社概要をご参照頂く他、利用者の求めに応じて遅滞なく回答します。</p>
                <p><strong>Eメールアドレス：</strong> lotuscard0722@gmail.com</p>
            `
        },
        terms: {
            title: '利用規約',
            content: `
                <p>本規約は、LotusCard（以下「当社」といいます。）が提供する「LotusCard」（以下「本サービス」といいます。）を利用される際に適用されます。ご利用にあたっては、本規約をお読みいただき、内容をご承諾の上でご利用ください。</p>
                
                <h3>第１条（規約の適用）</h3>
                <p>１　本規約は、当社が本サービスを提供する上で、利用者が本サービスの提供を受けるにあたっての諸条件を定めたものです。</p>
                <p>２　当社は、本サービスの提供に関して、本規約のほか、本サービスの利用に関する個別規約その他のガイドライン等を定めることがあります。この場合、当該個別規約その他のガイドライン等は、本規約の一部として利用者による本サービスの利用に優先して適用されるものとします。</p>
                <p>３　利用者が本サービスを利用された場合、利用者が本規約に同意したものとみなします。</p>
                <p>４　利用者が、未成年の場合、利用者は、本サービスの利用について、親権者等法定代理人の同意を得なければなりません。当社は、未成年者の利用者による本サービスの利用については、親権者等法定代理人の同意を得て行為されたものとみなします。</p>
                
                <h3>第2条（商品等の購入又は利用）</h3>
                <p>１　利用者は、本サービスにより提供される商品、デジタルコンテンツ又は役務（以下「商品等」といいます。）を購入又は利用しようとする場合、当社が指定する方法に従って、商品等の購入又は利用の申込みを行うものとします。</p>
                <p>２　前項の申込みにあたり、利用者が入力した事項及び申込内容を確認の上、申込みを確定するボタンをクリックし、当社が申込みを受信した時をもって、当社との間で当該商品等の購入又は利用に係る契約が成立するものとします。</p>
                <p>３　本条の規定に拘わらず、本サービスの利用に関して本規約の違反があった場合、当社は、売買契約の解除、損害賠償請求その他当社が適当と考える措置を講じることができるものとします。当該措置によって利用者が被った損害又は不利益については、当社の故意又は重過失による場合を除いて、当社は一切の責任を負いません。</p>
                
                <h3>第3条（支払方法）</h3>
                <p>１　利用者は、前条の商品等の購入手続において表示される商品等の代金を支払うものとします。</p>
                <p>２　商品等の代金の支払方法は、購入手続において案内される方法又は当社が別途認める支払方法とします。</p>
                <p>３　クレジットカードによる支払の場合、利用者は、利用者がクレジットカード会社との間で別途契約する条件に従うものとします。クレジットカードの利用に関連して、利用者とクレジットカード会社との間で何らかの紛争が発生した場合、利用者は、自己の責任と費用において、当該紛争を解決するものとします。</p>
                
                <h3>第4条（所有権及び危険負担）</h3>
                <p>商品の所有権は、当社又は当社と提携する第三者が商品を配送業者に引き渡した時点で、利用者に移転するものとし、当該商品に関する危険は当該時点で利用者に移転するものとします。</p>
                
                <h3>第5条（コンテンツの利用）</h3>
                <p>申込みの対象がデジタルコンテンツの場合、当該デジタルコンテンツの利用に係る契約の成立後、当該デジタルコンテンツは利用可能となります。ダウンロードされたものの紛失、破壊又は損傷は利用者の責任となります。疑義を避けるために付言すると、デジタルコンテンツに係る著作権等の知的財産権が利用者に譲渡されるものではございません。</p>
                
                <h3>第6条（商品等の返品・交換）</h3>
                <p>１　本サービスに関し、商品等の返品及び交換は、以下の場合を除き、受け付けておりません。</p>
                <p>（１）商品等の欠陥や不良による場合</p>
                <p>この場合、商品等の到着後8日間以内に、当社の指定する方法により、当社に通知することで行うものとします。</p>
                <p>（２）その他当社が独自に定める場合</p>
                <p>この場合、当社のウェブサイト等で案内する方法によるものとします。</p>
                <p>２　未成年の利用者による購入についても、親権者等法定代理人の同意のもと購入したものとみなされますので、商品等の返品及び交換は受け付けておりません。</p>
                
                <h3>第7条（商品等に関する免責）</h3>
                <p>１　本サービスを通じて販売される商品等の品質、機能、性能、他の物品との適合性その他の欠陥に関する当社の責任は、当社の故意又は重過失による場合を除いて、前条に定めるものに限られるものとします。</p>
                <p>２　当社は、本サービスのウェブサイト上の表示及び利用者が投稿した商品等に関する写真及びコメント並びにTwitter、Instagramその他のSNSサービスに投稿したコメントについて、適法性、有用性、完全性、正確性、最新性、信頼性、特定目的への適合性を含め何らの保証をしません。</p>
                
                <h3>第8条（知的財産権及びコンテンツ）</h3>
                <p>本サービスを構成する全ての素材に関する著作権を含む知的財産権その他の一切の権利は、当社又は当該権利を有する第三者に帰属しています。利用者は、本サービスの全ての素材に関して、一切の権利を取得することはないものとし、権利者の許可なく、素材に関する権利を侵害する一切の行為をしてはならないものとします。本規約に基づく本サービスの利用の許諾は、本サービスに関する当社又は当該権利を有する第三者の権利の使用許諾を意味するものではありません。</p>
                
                <h3>第9条（利用者へのお知らせ）</h3>
                <p>当社は、利用者に、当社が提供するサービスの最新情報やおすすめのお知らせのために定期的又は不定期にメールマガジンの配信、スマートフォン等のアプリのプッシュ通知を行います。</p>
                
                <h3>第10条（サービスの内容の変更、追加、停止）</h3>
                <p>当社は、利用者に事前の通知をすることなく、本サービスの内容の全部又は一部を変更、追加又は停止する場合があり、利用者はこれをあらかじめ承諾するものとします。</p>
                
                <h3>第11条（個人情報）</h3>
                <p>当社は、利用者による本サービスの利用によって取得する個人情報を、当社のプライバシーポリシーに従い、適切に取り扱います。</p>
                
                <h3>第12条（禁止事項）</h3>
                <p>１　利用者は、次の行為を行うことはできません。</p>
                <p>（１）本サービスの運営を妨げ、又はそのおそれのある行為</p>
                <p>（２）他の利用者による本サービスの利用を妨害する行為</p>
                <p>（３）本サービスにかかる著作権その他の権利を侵害する行為</p>
                <p>（４）当社、他の利用者又は第三者の権利又は利益（名誉権、プライバシー権及び著作権を含みますが、これらに限られません。）を侵害する行為</p>
                <p>（５）公序良俗その他法令に違反する行為及びこれに違反する恐れのある行為</p>
                <p>（６）本規約に違反する行為</p>
                <p>（７）前各号の他、本サービスの趣旨に鑑みて当社が不適切と判断する行為</p>
                <p>２　利用者が前項に定める行為を行ったと当社が判断した場合、当社は、利用者に事前に通知することなく、本サービスの全部又は一部の利用停止その他当社が必要かつ適切と判断する措置を講じることができます。本項の措置により利用者に生じる損害又は不利益について、当社は、一切の責任を負わないものとします。</p>
                
                <h3>第13条（反社会的勢力の排除）</h3>
                <p>利用者は、当社に対し、次の事項を確約します。</p>
                <p>（１）自らが、暴力団、暴力団関係企業、総会屋若しくはこれらに準ずる者又はその構成員（以下総称して「反社会的勢力」といいます。）ではないこと。</p>
                <p>（２）自らの役員（業務を執行する社員、取締役、執行役又はこれらに準ずる者をいいます。）が反社会的勢力ではないこと。</p>
                <p>（３）反社会的勢力に自己の名義を利用させ、本契約を締結するものでないこと。</p>
                <p>（４）自ら又は第三者を利用して、次の行為をしないこと。</p>
                <p>　① 相手方に対する脅迫的な言動又は暴力を用いる行為</p>
                <p>　② 法的な責任を超えた不当な要求行為</p>
                <p>　③ 偽計又は威力を用いて相手方の業務を妨害し、又は信用を毀損する行為</p>
                
                <h3>第14条（免責事項）</h3>
                <p>１　天災地変、戦争、テロ行為、暴動、労働争議、伝染病、法令の制定改廃、政府機関の介入その他不可抗力により、本サービスの全部又は一部の停止、中断、遅延が発生した場合、当社は、利用者に生じた損害又は不利益について一切責任を負いません。</p>
                <p>２　利用者は、通信回線やコンピュータの障害、システムメンテナンスその他の事由による本サービスの全部又は一部の停止、中断、遅延が起こり得ることを理解しているものとし、当社は、これらにより利用者に生じた損害又は不利益について一切責任を負いません。また、利用者の利用環境によって生じた損害又は不利益について、当社は一切の責任を負いません。</p>
                <p>３　当社は、以下の掲げる事項について、明示的にも黙示的にも保証しません。</p>
                <p>（１）本サービスの内容及び本サービスを通じて提供される情報の、有用性、完全性、正確性、最新性、信頼性、特定目的への適合性。</p>
                <p>（２）本サービスで提供される情報が第三者の権利を侵害しないものであること。</p>
                <p>（３）本サービスが将来にわたって存続し続けること。</p>
                <p>４　当社は、理由の如何を問わず、データ等の全部又は一部が滅失、毀損、又は改ざんされた場合に、これを復元する義務を負わないものとし、当該滅失、毀損、又は改ざんによりお客さま又は第三者に生じた損害等について一切の責任を負わないものとします。</p>
                <p>５　当社は、利用者による本サービスの利用に関連して、利用者に対して責任を負う場合には、該当の商品等の価額を超えて賠償する責任を負わないものとし、また、付随的損害、間接損害、特別損害、将来の損害および逸失利益にかかる損害については、賠償する責任を負わないものとします。</p>
                <p>６　本条の他の条項にかかわらず、本サービスに関する当社と利用者との間の契約が消費者契約法に定める消費者契約となる場合であって、かつ、当社の故意又は重過失に起因するときは、免責規定は適用されません。</p>
                
                <h3>第15条（秘密保持）</h3>
                <p>利用者は、本サービスの利用にあたり、当社より開示を受け、又は知り得た一切の情報について、第三者に開示又は漏えいしてはならず、本サービスの利用以外の目的に使用してはなりません。</p>
                
                <h3>第16条（当社からの通知）</h3>
                <p>１　当社から利用者に対して通知を行う場合、利用者が登録した電子メールアドレス宛に電子メールを送信する方法、本サービスに係るウェブサイト上への掲示その他当社が適当と判断する方法により行うものとします。</p>
                <p>２　当社が通知を行う場合において、前項の電子メールアドレス宛に送信した場合、当該電子メールアドレスのメールサーバーに記録された時点で、当社の通知は利用者に到達したものとみなします。</p>
                <p>３　利用者は、第1項の電子メールアドレスに変更がある場合、速やかに当社に通知するものとします。本項の変更の通知を受けるまでに当社が変更前の電子メールアドレス宛に送信した通知は、その発信の時点で利用者に到達したものとみなします。</p>
                <p>４　利用者が前項に定める通知を怠ったことにより、利用者に損害又は不利益が生じたとしても、当社は何らの責任を負いません。</p>
                
                <h3>第17条（第三者との紛争）</h3>
                <p>１　本サービスに関連して利用者と第三者間で発生した紛争については、利用者は自らの費用と責任で解決するものとし、当社は一切の責任を負わないものとします。</p>
                <p>２　前項に関し、当社が損害（弁護士費用を含みます。）を被った場合、利用者は当該損害を賠償するものとします。</p>
                
                <h3>第18条（権利義務の譲渡禁止）</h3>
                <p>利用者は、本規約に基づく契約上の地位及びこれにより生じる権利義務の全部または一部について、当社の書面による事前の承諾なく、第三者に対し、譲渡、移転、担保権の設定その他の処分をすることができません。</p>
                
                <h3>第19条（分離可能性）</h3>
                <p>本規約のいずれかの条項が利用者との本規約に基づく契約に適用される法令に違反し、無効とされる場合、当該条項は、その違反とされる限りにおいて、当該利用者との契約には適用されないものとします。この場合でも、本規約の他の条項の効力には影響しません。</p>
                
                <h3>第20条（本規約の変更）</h3>
                <p>当社は、本規約を変更する必要が生じた場合には、民法第548条の4（定型約款の変更）に基づき、本規約を変更することができます。本規約を変更する場合、当社は、その効力発生日を定め、効力発生日までに、電子メールの送信その他の方法により以下の事項を周知するものとします。</p>
                <p>（１）本規約を変更する旨</p>
                <p>（２）変更後の本規約の内容</p>
                <p>（３）効力発生日</p>
                
                <h3>第21条（準拠法、裁判管轄）</h3>
                <p>１　本規約は、日本法に準拠して解釈されます。</p>
                <p>２　当社及び利用者は、本サービスに関し、当社と利用者との間で生じた紛争の解決について、利用者は商品等の引渡しを受けた日から大阪地方裁判所を第一審の専属的合意管轄裁判所とすることにあらかじめ合意します。</p>
            `
        },
        commercial: {
            title: '特商法取引の記載',
            content: `
                <h3>特定商取引法に基づく表記</h3>
                
                <h3>事業者</h3>
                <p><strong>屋号:</strong> LotusCard</p>
                <p><strong>氏名:</strong> 山口 夏翔, 山元 来輝 （共同事業）</p>
                
                <h3>所在地</h3>
                <p>〒661-0046 兵庫県尼崎市常松2-14-47</p>
                
                <h3>連絡先</h3>
                <p><strong>電話番号:</strong> 070-1796-7210</p>
                <p><strong>メールアドレス:</strong> lotuscard0722@gmail.com</p>
                <p>※お問い合わせは原則としてメールにてお願いいたします。</p>
                
                <h3>販売責任者</h3>
                <p>山口 夏翔, 山元 来輝</p>
                
                <h3>販売価格</h3>
                <p>各商品・サービスの販売ページに表示された価格（表示価格は消費税込み）に準じます。</p>
                
                <h3>お支払い方法</h3>
                <ul>
                    <li>クレジットカード決済</li>
                    <li>PayPay</li>
                    <li>銀行振込</li>
                </ul>
                
                <h3>お支払い時期</h3>
                <ul>
                    <li><strong>クレジットカード決済、PayPay:</strong> ご注文時にお支払いが確定いたします。</li>
                    <li><strong>銀行振込:</strong> 法人・団体のお客様に限り、銀行振込も承っております。ご希望の場合は、お問い合わせください。</li>
                </ul>
                
                <h3>商品の引渡時期</h3>
                <p>ご注文および決済の完了後、お客様とのデザインに関する打ち合わせを経て、通常14営業日以内にWebサイトの納品および物理カードの発送をいたします。</p>
                
                <h3>返品・交換について</h3>
                <p>本商品はオーダーメイド製品であり、またデジタルコンテンツを含むサービスの性質上、お客様のご都合による返品・返金・交換は一切お受けできません。</p>
                <p>万が一、お届けした物理カードに欠陥があった場合に限り、良品と交換いたします。</p>
            `
        }
    };
    
    // モーダルを開く関数
    function openModal(modalType) {
        if (modalContent[modalType]) {
            modalTitle.textContent = modalContent[modalType].title;
            modalBody.innerHTML = modalContent[modalType].content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // スクロールを無効化
        }
    }
    
    // モーダルを閉じる関数
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // スクロールを有効化
    }
    
    // モーダルリンクのイベントリスナー
    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalType = link.getAttribute('data-modal');
            openModal(modalType);
        });
    });
    
    // 閉じるボタンのイベントリスナー
    closeButton.addEventListener('click', closeModal);
    
    // オーバーレイクリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    }

    // お問い合わせモーダル管理
    function initContactModal() {
        const contactModal = document.getElementById('contact-modal');
        const contactForm = document.getElementById('contact-form');
        const closeButton = contactModal.querySelector('.modal-close-button');
        const cancelButton = contactModal.querySelector('.contact-cancel-btn');
        
        // お問い合わせモーダルを開く
        function openContactModal() {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // お問い合わせモーダルを閉じる
        function closeContactModal() {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
            contactForm.reset();
        }
        
        // お問い合わせボタンのクリックイベント
        const contactButtons = document.querySelectorAll('[data-contact]');
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openContactModal();
            });
        });
        
        // フォーム送信処理（FormSubmitに直接送信するため完全削除）
        // contactForm.addEventListener('submit', async (e) => {
        //     // FormSubmitに直接送信するため、すべての処理を無効化
        //     return;
        //     const submitButton = contactForm.querySelector('.contact-submit-btn');
        //     const originalText = submitButton.textContent;
        //     
        //     // 送信中の状態に変更
        //     submitButton.textContent = '送信中...';
        //     submitButton.disabled = true;
        //     
        //     try {
        //         const formData = new FormData(contactForm);
        //         const contactData = {
        //             name: formData.get('name'),
        //             email: formData.get('email'),
        //             subject: formData.get('subject'),
        //             message: formData.get('message')
        //         };
        //         
        //         // バリデーション
        //         if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
        //             throw new Error('すべての項目を入力してください。');
        //         }
        //         
        //         // メールアドレスの形式チェック
        //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //         if (!emailRegex.test(contactData.email)) {
        //             throw new Error('正しいメールアドレスを入力してください。');
        //         }
        //         
        //         // 実際のメール送信処理
        //         await sendContactEmail(contactData);
        //         
        //         // 成功メッセージを表示
        //         showSuccessMessage('お問い合わせを送信しました。ありがとうございます。');
        //         
        //         // フォームをリセット
        //         contactForm.reset();
        //         
        //         // モーダルを閉じる
        //         setTimeout(() => {
        //             closeContactModal();
        //         }, 2000);
        //         
        //     } catch (error) {
        //         console.error('送信エラー:', error);
        //         showErrorMessage(error.message || '送信に失敗しました。');
        //     } finally {
        //         // ボタンの状態を元に戻す
        //         submitButton.textContent = originalText;
        //         submitButton.disabled = false;
        //     }
        // });
        
        // 実際のメール送信処理（FormSubmitに直接送信するため無効化）
        async function sendContactEmail(contactData) {
            // FormSubmitに直接送信するため、この関数は使用しない
            return { success: true, method: 'FormSubmit' };
            
            try {
                // 1. まずEmailJSを試行（実際のメール送信）
                if (false && typeof emailjs !== 'undefined') {
                    console.log('EmailJSを使用してメール送信を試行...');
                    
                    // EmailJSでメール送信
                    const result = await emailjs.send(
                        'service_soau889',
                        'service_lotuscard',
                        {
                            from_name: contactData.name,
                            from_email: contactData.email,
                            subject: contactData.subject,
                            message: contactData.message,
                            to_email: 'lotuscard0722@gmail.com'
                        },
                        '4HPskWju_zy_GWqDD'
                    );
                    
                    console.log('EmailJS送信成功:', result);
                    return { success: true, method: 'EmailJS' };
                }
                
                // 2. FormSubmitを使用（最も簡単な方法）
                console.log('FormSubmitを使用してメール送信を試行...');
                const formSubmitResponse = await fetch('https://formsubmit.co/lotuscard0722@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: contactData.name,
                        email: contactData.email,
                        subject: contactData.subject,
                        message: contactData.message,
                        _replyto: contactData.email,
                        _subject: `【お問い合わせ】${contactData.subject}`,
                        _template: 'table'
                    })
                });
                
                if (formSubmitResponse.ok) {
                    console.log('FormSubmit送信成功');
                    return { success: true, method: 'FormSubmit' };
                } else {
                    console.error('FormSubmit送信失敗:', formSubmitResponse.status);
                }
                
                // 3. Formspreeを使用
                console.log('Formspreeを使用してメール送信を試行...');
                const formspreeResponse = await fetch('https://formspree.io/f/your_form_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: contactData.name,
                        email: contactData.email,
                        subject: contactData.subject,
                        message: contactData.message,
                        _replyto: contactData.email
                    })
                });
                
                if (formspreeResponse.ok) {
                    const result = await formspreeResponse.json();
                    console.log('Formspree送信成功:', result);
                    return { success: true, method: 'Formspree' };
                }
                
                throw new Error('すべてのメール送信方法が失敗しました');
                
            } catch (error) {
                console.error('メール送信エラー:', error);
                
                // 4. フォールバック: アプリ内処理
                console.log('アプリ内処理でメール送信を完了...');
                await simulateEmailSending(contactData);
                return { success: true, method: 'App Internal' };
            }
        }
        
        // メール送信のシミュレーション（アプリ内完結型）
        async function simulateEmailSending(contactData) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 送信ログをコンソールに出力
                    console.log('=== お問い合わせ送信（アプリ内処理） ===');
                    console.log('送信日時:', new Date().toLocaleString('ja-JP'));
                    console.log('お名前:', contactData.name);
                    console.log('メールアドレス:', contactData.email);
                    console.log('件名:', contactData.subject);
                    console.log('メッセージ:', contactData.message);
                    console.log('送信先: lotuscard0722@gmail.com');
                    console.log('処理方法: アプリ内データ保存');
                    console.log('========================');
                    
                    // ローカルストレージに保存（実際の運用ではサーバーに送信）
                    const contactLog = {
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        name: contactData.name,
                        email: contactData.email,
                        subject: contactData.subject,
                        message: contactData.message,
                        status: 'received'
                    };
                    
                    // 既存のログを取得
                    const existingLogs = JSON.parse(localStorage.getItem('contactLogs') || '[]');
                    existingLogs.push(contactLog);
                    localStorage.setItem('contactLogs', JSON.stringify(existingLogs));
                    
                    console.log('お問い合わせデータをローカルストレージに保存しました');
                    console.log('保存されたデータ:', contactLog);
                    
                    // 送信成功をシミュレート
                    resolve();
                }, 2000); // 2秒の送信処理をシミュレート
            });
        }
        
        // 成功メッセージ表示
        function showSuccessMessage(message) {
            const existingAlert = document.querySelector('.contact-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            const alert = document.createElement('div');
            alert.className = 'contact-alert success';
            alert.textContent = message;
            contactModal.querySelector('.contact-form').appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
        
        // エラーメッセージ表示
        function showErrorMessage(message) {
            const existingAlert = document.querySelector('.contact-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            const alert = document.createElement('div');
            alert.className = 'contact-alert error';
            alert.textContent = message;
            contactModal.querySelector('.contact-form').appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
        
        // 閉じるボタンのイベント
        closeButton.addEventListener('click', closeContactModal);
        cancelButton.addEventListener('click', closeContactModal);
        
        // オーバーレイクリックで閉じる
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                closeContactModal();
            }
        });
        
        // お問い合わせデータ確認機能（開発用）
        window.checkContactLogs = function() {
            const logs = JSON.parse(localStorage.getItem('contactLogs') || '[]');
            console.log('=== お問い合わせログ ===');
            console.log('総件数:', logs.length);
            logs.forEach((log, index) => {
                console.log(`--- ${index + 1}件目 ---`);
                console.log('ID:', log.id);
                console.log('送信日時:', new Date(log.timestamp).toLocaleString('ja-JP'));
                console.log('お名前:', log.name);
                console.log('メールアドレス:', log.email);
                console.log('件名:', log.subject);
                console.log('メッセージ:', log.message);
                console.log('ステータス:', log.status);
            });
            return logs;
        };
        
        // お問い合わせデータクリア機能（開発用）
        window.clearContactLogs = function() {
            localStorage.removeItem('contactLogs');
            console.log('お問い合わせログをクリアしました');
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
        initSmoothScroll();
        initFaqAccordion();
        initModal();
        initContactModal();
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
