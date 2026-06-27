document.addEventListener('DOMContentLoaded', function () {
    console.log("Скрипт с общим стилем Win95 загружен!");

    // 1. Находим все коробки
    const boxes = document.querySelectorAll('.box-item');

    if (boxes.length === 0) {
        console.error("Коробки не найдены!");
        return;
    }

    // 2. Удаляем старую модалку, если есть
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // 3. Создаем модальное окно с использованием ТВОЕГО класса .win95-new
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    // Базовые стили для подложки (не трогаем .win95-new)
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        pointer-events: none;
    `;

    // Внутренность окна (используем ТВОЙ .win95-new и его структуру)
    modal.innerHTML = `
        <div class="win95-new modal-box" style="
            width: 420px;
            max-width: 90vw;
            transform: scale(0.9);
            transition: transform 0.2s ease;
            position: relative;
        ">
            <!-- Заголовок (Твой стиль .titlebar) -->
            <div class="titlebar">
                <span>📀 Аниме - Просмотр</span>
                <div class="win-buttons">
                    <span class="win-btn">─</span>
                    <span class="win-btn">□</span>
                    <span class="win-btn win-btn-close">✕</span>
                </div>
            </div>

            <!-- Меню (Твой стиль .menu) -->
            <div class="menu">
                <span class="menu-item">Файл</span>
                <span class="menu-item">Правка</span>
                <span class="menu-item">Помощь</span>
            </div>

            <!-- Содержимое (Твой стиль .content) -->
            <div class="content" style="display: flex; flex-direction: column; align-items: center; padding: 15px;">
                <img id="modal-poster" src="" alt="Poster" style="
                    width: 100%;
                    max-height: 400px;
                    object-fit: contain;
                    border: 2px solid #000;
                    background: #000;
                    margin-bottom: 10px;
                ">
                
                <h2 id="modal-name" style="
                    color: #000;
                    font-size: 18px;
                    margin: 0;
                    font-family: 'Segoe UI', sans-serif;
                    font-weight: bold;
                    text-align: center;
                ">Название</h2>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // 4. Элементы внутри модалки
    const modalBox = modal.querySelector('.modal-box');
    const modalPoster = document.getElementById('modal-poster');
    const modalName = document.getElementById('modal-name');
    const closeBtn = modal.querySelector('.win-btn-close');

    // 5. Функция открытия
    function openModal(title, posterSrc) {
        if (posterSrc && title) {
            modalName.textContent = title;
            modalPoster.src = posterSrc;

            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.pointerEvents = 'auto';

            setTimeout(() => {
                modalBox.style.transform = 'scale(1)';
            }, 10);
        }
    }

    // 6. Функция закрытия
    function closeModal() {
        modalBox.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
        }, 200);
    }

    // 7. Клик по коробкам
    boxes.forEach(function (box) {
        box.addEventListener('click', function (event) {
            event.stopPropagation();

            const title = this.getAttribute('data-title');
            const poster = this.getAttribute('data-poster');

            if (title && poster) {
                openModal(title, poster);
            }
        });
    });

    // 8. Закрытие
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

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

    // Проверка наличия элементов
    if (!starsContainer) {
        console.error('❌ ОШИБКА: starsContainer не найден!');
        return;
    }
    if (!startBtn) {
        console.error('❌ ОШИБКА: startGameBtn не найден!');
        return;
    }

    // ========== СЛУЧАЙНАЯ ПОЗИЦИЯ ==========
    function getRandomPosition() {
        const top = Math.random() * 80 + 5;
        const left = Math.random() * 80 + 5;
        return { top: `${top}%`, left: `${left}%` };
    }

    // ========== СОЗДАНИЕ ЗВЕЗДЫ ==========
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
                if (starMessageEl) {
                    starMessageEl.innerHTML = `
                        🎉 ПОБЕДА! 🎉<br>
                        Ты собрал все звёзды!<br>
                        В награду ты допущен в лучший канал мира<br>
                        <a href="https://t.me/ooooouiiu" target="_blank" class="win95-btn" style="display: inline-block; margin-top: 10px; padding: 5px 15px; text-decoration: none; font-size: 12px; color: #000; background: #c0c0c0; border-top: 2px solid #fff; border-left: 2px solid #fff; border-right: 2px solid #000; border-bottom: 2px solid #000;">Перейти в канал ➡️</a>
                    `;
                }
                if (winGifEl) winGifEl.style.display = 'block';
                console.log('🎉 ПОБЕДА!');
            } else if (starMessageEl) {
                const remaining = TOTAL_STARS - collectedStars;
                starMessageEl.innerHTML = `⭐ Осталось ${remaining} звёздочек! ⭐`;
            }
        });

        return star;
    }

    // ========== ПЕРЕСОЗДАНИЕ ЗВЁЗД ==========
    function regenerateStars() {
        if (!starsContainer) return;

        starsContainer.innerHTML = '';
        stars = [];

        console.log('🔄 Генерация новых звёзд...');

        for (let i = 0; i < TOTAL_STARS; i++) {
            const position = getRandomPosition();
            const star = createStar(i, position);
            starsContainer.appendChild(star);
            stars.push(star);
        }
        console.log('✨ Создано звёзд:', stars.length);
    }

    // ========== ПОКАЗАТЬ / СКРЫТЬ ==========
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

    // ========== СБРОС ИГРЫ ==========
    function resetGame() {
        collectedStars = 0;
        gameActive = false;
        if (starCountEl) starCountEl.textContent = '0';
        if (winGifEl) winGifEl.style.display = 'none';
        if (starMessageEl) starMessageEl.innerHTML = '🔒 Нажми "Старт" чтобы начать! 🔒';

        regenerateStars();
        hideAllStars();
        console.log('🔄 Игра сброшена');
    }

    // ========== СТАРТ ИГРЫ ==========
    function startGame() {
        if (gameActive) return;
        console.log('🎮 СТАРТ ИГРЫ!');

        regenerateStars();
        collectedStars = 0;
        gameActive = true;

        if (starCountEl) starCountEl.textContent = '0';
        if (starMessageEl) starMessageEl.innerHTML = '⭐ Собери все звёздочки! ⭐';
        if (winGifEl) winGifEl.style.display = 'none';

        showAllStars();
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    regenerateStars();
    hideAllStars();

    startBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        startGame();
    });

    console.log('🎮 Игра готова! При каждом старте звёзды будут в НОВЫХ местах');
});
// ==========================================================================
// 2. СИНИЙ ЭКРАН СМЕРТИ (BSOD)
// ==========================================================================
const bsodOverlay = document.getElementById('bsod');
const bsodRestartBtn = document.getElementById('bsod-restart');

function showBsod() {
    if (!bsodOverlay) return;
    console.log('🔵 Открываем синий экран');
    bsodOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideBsod() {
    if (!bsodOverlay) return;
    console.log('🟦 Закрываем синий экран');
    bsodOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Открытие синего экрана при нажатии на крестик (win95-new стиль)
document.querySelectorAll('.win-btn-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showBsod();
    });
});

// Перезагрузка системы на BSOD
if (bsodRestartBtn) {
    bsodRestartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        hideBsod();
    });
}

// Закрытие по клику на фон (если нужно)
if (bsodOverlay) {
    bsodOverlay.addEventListener('click', (e) => {
        if (e.target === bsodOverlay) {
            hideBsod();
        }
    });
}

// --- НАСТРОЙКА ТРЕКОВ (ЗАМЕНИ НА СВОИ) ---
const playlist = [
    { title: "Трек 1 - Название", src: "music/track1.mp3" },
    { title: "Трек 2 - Название", src: "music/track2.mp3" },
    { title: "Трек 3 - Название", src: "music/track3.mp3" },
    { title: "Трек 4 - Название", src: "music/track4.mp3" }
];

const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;

// Элементы
const container = document.getElementById('playlistContainer');
const reelLeft = document.getElementById('reelLeft');
const reelRight = document.getElementById('reelRight');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const progressTrack = document.getElementById('progressTrack');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

// 1. Отрисовка списка песен
function renderPlaylist() {
    container.innerHTML = '';
    playlist.forEach((track, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        div.textContent = track.title;
        if (index === currentTrackIndex) div.classList.add('active');
        div.onclick = () => playTrack(index);
        container.appendChild(div);
    });
}

// 2. Функция проигрывания трека
function playTrack(index) {
    currentTrackIndex = index;
    audio.src = playlist[index].src;
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<span class="btn-content">⏸</span>';

    // Запускаем вращение каждой бобины отдельно
    reelLeft.classList.add('spinning-left');
    reelRight.classList.add('spinning-right');

    renderPlaylist();
}

// 3. Пауза / Продолжение
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<span class="btn-content">▶</span>';
        reelLeft.classList.remove('spinning-left');
        reelRight.classList.remove('spinning-right');
    } else {
        if (audio.src) {
            audio.play();
            isPlaying = true;
            playBtn.innerHTML = '<span class="btn-content">⏸</span>';
            reelLeft.classList.add('spinning-left');
            reelRight.classList.add('spinning-right');
        } else {
            playTrack(0);
        }
    }
}

// 4. Кнопки Стоп, Назад, Вперед
stopBtn.onclick = () => {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    playBtn.innerHTML = '<span class="btn-content">▶</span>';
    reelLeft.classList.remove('spinning-left');
    reelRight.classList.remove('spinning-right');
    progressFill.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTimeEl.textContent = '0:00';
};

prevBtn.onclick = () => {
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    playTrack(newIndex);
};

nextBtn.onclick = () => {
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= playlist.length) newIndex = 0;
    playTrack(newIndex);
};

// 5. Обработчики кнопок
playBtn.onclick = togglePlay;

// 6. Обновление прогресс-бара и времени
audio.ontimeupdate = () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        progressThumb.style.left = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
};

// 7. Клик по прогресс-бару для перемотки
progressTrack.onclick = (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = (clickX / rect.width) * 100;
    if (audio.duration) {
        audio.currentTime = (percent / 100) * audio.duration;
    }
};

// 8. Вспомогательная функция для времени
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
}

// Инициализация
renderPlaylist();
// 8. Вспомогательная функция для времени (00:00)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
}

// Инициализация
renderPlaylist();

// ==========================================
// ПОКАЗ ПАНЕЛИ ТОЛЬКО В САМОМ НИЗУ
// ==========================================

const bottomBar = document.getElementById('win95BottomBar');

window.addEventListener('scroll', function () {
    // Высота всего документа минус высота экрана = точка, где мы в самом низу
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Если мы внизу (с запасом в 30px), показываем
    if (scrollPosition >= documentHeight - 30) {
        bottomBar.classList.add('show');
    } else {
        // Как только отматываем вверх — скрываем
        bottomBar.classList.remove('show');
    }
});