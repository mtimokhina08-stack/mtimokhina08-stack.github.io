(function () {
    // ========== 2. ПОЯВЛЕНИЕ ПЛАШЕК ПРИ СКРОЛЛЕ ==========
    const cards = document.querySelectorAll('.card');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -20px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        appearOnScroll.observe(card);
    });

    // Дополнительная проверка для уже видимых элементов при загрузке
    function checkVisibleOnLoad() {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 50 && rect.bottom > 0) {
                card.classList.add('visible');
                appearOnScroll.unobserve(card);
            }
        });
    }

    window.addEventListener('load', checkVisibleOnLoad);

    // ========== 4. ИНТЕРАКТИВ ПРИ КЛИКЕ НА ПЛАШКУ ==========
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardId = card.getAttribute('data-card') || (index + 1);
            console.log(`🎴 Нажата плашка №${cardId}`);
        });
    });


    // ===============================================
    // СИНИЙ ЭКРАН — ТОЛЬКО ПРИ НАЖАТИИ НА КРЕСТИК
    // ===============================================

    const bsodOverlay = document.getElementById('bsod');
    const bsodRestartBtn = document.getElementById('bsod-restart');

    function showBsod() {
        if (!bsodOverlay) return;
        console.log('Открываем синий экран');
        bsodOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideBsod() {
        if (!bsodOverlay) return;
        console.log('Закрываем синий экран');
        bsodOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Открытие синего экрана ТОЛЬКО при нажатии на крестик (кнопка закрытия)
    document.querySelectorAll('.window-btn-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Клик по крестику');
            showBsod();
        });
    });

    // Кнопка перезагрузки на синем экране
    if (bsodRestartBtn) {
        bsodRestartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Клик по кнопке перезагрузки');
            hideBsod();
        });
    }


    // ===============================================
    // МИНИ-ИГРА: СБОР ЗВЁЗДОЧЕК (ТОЛЬКО НА ГЛАВНОМ ЭКРАНЕ)
    // ===============================================
    (function () {
        const TOTAL_STARS = 10;
        let collectedStars = 0;

        const starsContainer = document.getElementById('starsContainer');
        const starsCountEl = document.getElementById('starsCount');
        const starsMessageEl = document.getElementById('starsMessage');
        const starsGifEl = document.getElementById('starsGif');

        const starPositions = [
            { top: '5%', left: '10%' },
            { top: '12%', left: '85%' },
            { top: '25%', left: '30%' },
            { top: '35%', left: '70%' },
            { top: '48%', left: '15%' },
            { top: '55%', left: '60%' },
            { top: '68%', left: '25%' },
            { top: '78%', left: '80%' },
            { top: '88%', left: '45%' },
            { top: '93%', left: '70%' }
        ];

        function createStar(starId, position) {
            const star = document.createElement('img');
            star.className = 'star';
            star.id = `star-${starId}`;
            star.src = 'img/star.gif';
            star.alt = '⭐';
            star.style.top = position.top;
            star.style.left = position.left;
            star.setAttribute('data-collected', 'false');

            star.addEventListener('click', (e) => {
                e.stopPropagation();
                if (star.getAttribute('data-collected') === 'true') return;

                star.setAttribute('data-collected', 'true');
                star.style.opacity = '0';
                star.style.transform = 'scale(0)';
                star.style.pointerEvents = 'none';

                collectedStars++;
                if (starsCountEl) starsCountEl.textContent = collectedStars;

                if (collectedStars === TOTAL_STARS) {
                    if (starsMessageEl) starsMessageEl.textContent = '';
                    if (starsGifEl) starsGifEl.style.display = 'block';

                    const victoryMsg = document.createElement('div');
                    victoryMsg.textContent = '✨ ВСЕ ЗВЁЗДЫ СОБРАНЫ! ✨';
                    victoryMsg.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #c0c0c0; padding: 20px 40px; border: 4px solid #ffffff;
                    border-right-color: #000000; border-bottom-color: #000000;
                    font-family: 'Courier New', monospace; font-size: 20px;
                    font-weight: bold; z-index: 100000; text-align: center;
                    box-shadow: 5px 5px 0px #000000;
                `;
                    document.body.appendChild(victoryMsg);
                    setTimeout(() => {
                        victoryMsg.style.opacity = '0';
                        victoryMsg.style.transition = 'opacity 0.5s';
                        setTimeout(() => victoryMsg.remove(), 500);
                    }, 3000);
                } else if (starsMessageEl) {
                    const remaining = TOTAL_STARS - collectedStars;
                    starsMessageEl.textContent = `Осталось ${remaining} звёздочек! ⭐`;
                }
            });

            return star;
        }

        function initStarsOnMain() {
            if (!starsContainer) return;
            starsContainer.innerHTML = 'Умничка!';
            for (let i = 0; i < starPositions.length; i++) {
                const star = createStar(i, starPositions[i]);
                starsContainer.appendChild(star);
            }
        }

        function initGame() {
            initStarsOnMain();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGame);
        } else {
            initGame();
        }
    })();
})();
