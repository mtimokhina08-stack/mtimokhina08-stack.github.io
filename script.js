(function () {
    'use strict';

    // ==========================================================================
    // 1. ИНИЦИАЛИЗАЦИЯ И ПОЯВЛЕНИЕ ПЛАШЕК ПРИ СКРОЛЛЕ
    // ==========================================================================
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

    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const cardId = card.getAttribute('data-card') || (index + 1);
            console.log(` 🎴  Нажата плашка №${cardId}`);
        });
    });

    // ==========================================================================
    // 2. СИНИЙ ЭКРАН СМЕРТИ (BSOD)
    // ==========================================================================
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

    document.querySelectorAll('.window-btn-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            showBsod();
        });
    });

    if (bsodRestartBtn) {
        bsodRestartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            hideBsod();
        });
    }

    // ==========================================================================
    // 3. МИНИ-ИГРА: СБОР ЗВЁЗДОЧЕК
    // ==========================================================================

    document.addEventListener('DOMContentLoaded', function () {

        const TOTAL_STARS = 10;
        let collectedStars = 0;
        let gameActive = false;
        let stars = [];

        const starsContainer = document.getElementById('starsContainer');
        const starCountEl = document.getElementById('starCount');
        const starMessageEl = document.getElementById('starMessage');
        const winGifEl = document.getElementById('winGif');
        const startBtn = document.getElementById('startGameBtn');

        if (!starsContainer) {
            console.error('ОШИБКА: starsContainer не найден!');
            return;
        }
        if (!startBtn) {
            console.error('ОШИБКА: startGameBtn не найден!');
            return;
        }

        // ВСЕГДА новые случайные позиции
        function getRandomPosition() {
            const top = Math.random() * 80 + 5;
            const left = Math.random() * 80 + 5;
            console.log(`Новая позиция: top=${top}%, left=${left}%`);
            return { top: `${top}%`, left: `${left}%` };
        }

        function createStar(id, position) {
            const star = document.createElement('img');
            star.className = 'star';
            star.src = 'img/star.gif';
            star.alt = '⭐';
            star.style.top = position.top;
            star.style.left = position.left;
            star.style.position = 'absolute';
            star.style.width = '35px';
            star.style.height = '35px';
            star.style.cursor = 'pointer';
            star.style.transition = 'all 0.2s ease';
            star.style.zIndex = '100001';
            star.style.display = 'none';
            star.setAttribute('data-id', id);
            star.setAttribute('data-collected', 'false');

            star.addEventListener('click', function (e) {
                e.stopPropagation();
                if (!gameActive) return;
                if (this.getAttribute('data-collected') === 'true') return;

                console.log('⭐ Звезда собрана!');
                this.setAttribute('data-collected', 'true');
                this.style.opacity = '0';
                this.style.transform = 'scale(0)';
                this.style.pointerEvents = 'none';

                collectedStars++;
                if (starCountEl) starCountEl.textContent = collectedStars;

                if (collectedStars === TOTAL_STARS) {
                    gameActive = false;
                    if (starMessageEl) starMessageEl.innerHTML = '🎉 ПОБЕДА! 🎉<br>Ты собрал все звёзды!<br>В награду ты допущен в лучший канал мира<br><a href="https://t.me/ooooouiiu" target="_blank" class="win95-btn" style="display: inline-block; margin-top: 10px; padding: 5px 15px; text-decoration: none; font-size: 12px;">Перейти в канал ➡️</a>';
                    if (winGifEl) winGifEl.style.display = 'block';
                    console.log('🎉 ПОБЕДА!');
                } else if (starMessageEl) {
                    const remaining = TOTAL_STARS - collectedStars;
                    starMessageEl.innerHTML = `⭐ Осталось ${remaining} звёздочек! ⭐`;
                }
            });

            return star;
        }

        // Полное удаление и пересоздание звёзд с НОВЫМИ позициями
        function regenerateStars() {
            if (!starsContainer) return;

            // Очищаем контейнер
            starsContainer.innerHTML = '';
            stars = [];

            console.log('🔄 Генерация новых звёзд со случайными позициями...');

            // Создаём новые звёзды с новыми позициями
            for (let i = 0; i < TOTAL_STARS; i++) {
                const position = getRandomPosition();
                const star = createStar(i, position);
                starsContainer.appendChild(star);
                stars.push(star);
            }
            console.log('✨ Создано звёзд:', stars.length);
        }

        function showAllStars() {
            stars.forEach(star => {
                if (star.getAttribute('data-collected') !== 'true') {
                    star.style.display = 'block';
                    star.style.opacity = '1';
                    star.style.transform = 'scale(1)';
                    star.style.pointerEvents = 'auto';
                }
            });
            console.log('✨ Звёзды показаны');
        }

        function hideAllStars() {
            stars.forEach(star => {
                star.style.display = 'none';
            });
            console.log('✨ Звёзды скрыты');
        }

        function resetGame() {
            collectedStars = 0;
            gameActive = false;
            if (starCountEl) starCountEl.textContent = '0';
            if (winGifEl) winGifEl.style.display = 'none';
            if (starMessageEl) starMessageEl.innerHTML = '🔒 Нажми "Старт" чтобы начать! 🔒';

            // ПОЛНОСТЬЮ пересоздаём звёзды с новыми позициями
            regenerateStars();
            hideAllStars();
            console.log('🔄 Игра сброшена, звёзды пересозданы');
        }

        function startGame() {
            if (gameActive) return;
            console.log('🎮 СТАРТ ИГРЫ!');

            // Пересоздаём звёзды с новыми позициями ПРИ КАЖДОМ СТАРТЕ
            regenerateStars();

            collectedStars = 0;
            gameActive = true;

            if (starCountEl) starCountEl.textContent = '0';
            if (starMessageEl) starMessageEl.innerHTML = '⭐ Собери все звёздочки! ⭐';
            if (winGifEl) winGifEl.style.display = 'none';

            showAllStars();
        }

        // Инициализация
        regenerateStars();  // звёзды созданы
        hideAllStars();     // скрыты

        startBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            startGame();
        });

        console.log('🎮 Игра готова! При каждом старте звёзды будут в НОВЫХ местах');
    });
    

})();