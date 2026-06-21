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

    // ===============================================
    // РЕТРО-ПЛЕЕР
    // ===============================================

    document.addEventListener('DOMContentLoaded', function () {

        const playlist = [
            { title: 'Моя мелодия', src: 'img/track/1.mp3' },
            { title: 'Второй трек', src: 'audio/track2.mp3' },
            { title: 'Ещё один', src: 'audio/track3.mp3' },
            { title: 'Любимый', src: 'audio/track4.mp3' },
            { title: 'Настроение', src: 'audio/track5.mp3' }
        ];

        let currentTrack = 0;
        let isPlaying = false;
        let audio = new Audio();

        const playBtn = document.querySelector('[data-action="play"]');
        const pauseBtn = document.querySelector('[data-action="pause"]');
        const stopBtn = document.querySelector('[data-action="stop"]');
        const prevBtn = document.querySelector('[data-action="prev"]');
        const nextBtn = document.querySelector('[data-action="next"]');
        const nowPlaying = document.getElementById('nowPlaying');
        const progressFill = document.getElementById('progressFill');
        const statusBar = document.getElementById('statusBar');
        const trackItems = document.querySelectorAll('.win95-list-item');

        function loadTrack(index) {
            const track = playlist[index];
            audio.src = track.src;
            nowPlaying.textContent = `▶ ${track.title}`;
            statusBar.textContent = `Загружен: ${track.title}`;
            currentTrack = index;
            trackItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            progressFill.style.width = '0%';
        }

        function playTrack() {
            audio.play();
            isPlaying = true;
            nowPlaying.textContent = `▶ ${playlist[currentTrack].title}`;
            statusBar.textContent = '▶ Воспроизведение...';
        }

        function pauseTrack() {
            audio.pause();
            isPlaying = false;
            statusBar.textContent = '⏸ Пауза';
        }

        function stopTrack() {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            progressFill.style.width = '0%';
            statusBar.textContent = '⏹ Остановлено';
            nowPlaying.textContent = `⏹ ${playlist[currentTrack].title}`;
        }

        function nextTrack() {
            const next = (currentTrack + 1) % playlist.length;
            loadTrack(next);
            if (isPlaying) playTrack();
        }

        function prevTrack() {
            const prev = (currentTrack - 1 + playlist.length) % playlist.length;
            loadTrack(prev);
            if (isPlaying) playTrack();
        }

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + '%';
            }
        });

        audio.addEventListener('ended', nextTrack);

        // Прогресс
        const progressBar = document.querySelector('.win95-progress');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        });

        // --- КНОПКИ ---
        playBtn.addEventListener('click', () => {
            if (!audio.src) loadTrack(0);
            playTrack();
        });

        pauseBtn.addEventListener('click', pauseTrack);
        stopBtn.addEventListener('click', stopTrack);
        nextBtn.addEventListener('click', nextTrack);
        prevBtn.addEventListener('click', prevTrack);

        trackItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                loadTrack(index);
                if (isPlaying) playTrack();
            });
        });

        loadTrack(0);
    });
    // ===============================================
    // ГОСТЕВАЯ КНИГА через Supabase
    // ===============================================

    // ТВОИ ДАННЫЕ (замени на свои!)
    const SUPABASE_URL = 'https://hdpzprdmliavjxjffypu.supabase.co';
    const SUPABASE_KEY = 'https://hdpzprdmliavjjxffypu.supabase.co/rest/v1/';  // Вставь свой ключ!

    // Загрузка сообщений
    async function loadMessages() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (!response.ok) throw new Error('Ошибка загрузки');
            return await response.json();
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            return [];
        }
    }

    // Сохранение сообщения
    async function saveMessage(name, text) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name || 'Аноним',
                    text: text,
                    date: new Date().toLocaleString()
                })
            });
            if (!response.ok) throw new Error('Ошибка сохранения');
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            return false;
        }
    }

    // Добавление сообщения
    async function addMessage(name, text) {
        await saveMessage(name, text);
        renderMessages();
    }

    // Отображение сообщений
    async function renderMessages() {
        const container = document.getElementById('guestbookContainer');
        if (!container) return;

        const messages = await loadMessages();
        if (messages.length === 0) {
            container.innerHTML = '<div class="guestbook-empty">Будь первым, кто оставит мнение! 💫</div>';
            return;
        }

        container.innerHTML = messages.map(msg => `
        <div class="guestbook-entry">
            <div class="guestbook-name">${msg.name || 'Аноним'}</div>
            <div class="guestbook-text">${msg.text}</div>
            <div class="guestbook-date">${msg.date || 'неизвестно'}</div>
        </div>
    `).join('');
    }

    // Обработчик формы
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('guestbookForm');
        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                const nameInput = document.getElementById('guestName');
                const textInput = document.getElementById('guestText');

                const name = nameInput.value.trim() || 'Аноним';
                const text = textInput.value.trim();

                if (text) {
                    await addMessage(name, text);
                    form.reset();
                }
            });
        }
        renderMessages();
    });
})();