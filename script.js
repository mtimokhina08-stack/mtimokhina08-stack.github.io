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
    // СИНИЙ ЭКРАН (BSOD) ПРИ НАЖАТИИ НА КРЕСТИК
    // ===============================================

    document.addEventListener('DOMContentLoaded', function () {
        const bsod = document.getElementById('bsod');
        const restartBtn = document.getElementById('bsod-restart');

        // Находим все кнопки закрытия (крестики) в плашках
        const closeButtons = document.querySelectorAll('.window-btn-close');

        // Функция открытия синего экрана
        function showBSOD() {
            bsod.classList.add('active');
            // Блокируем скролл на фоне
            document.body.style.overflow = 'hidden';
        }

        // Функция закрытия синего экрана (возврат на сайт)
        function hideBSOD() {
            bsod.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Добавляем обработчик на каждую кнопку закрытия
        closeButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.stopPropagation(); // Чтобы не сработали другие обработчики
                showBSOD();
            });
        });

        // Перезагрузка (закрытие синего экрана)
        restartBtn.addEventListener('click', function () {
            hideBSOD();
        });

        // Закрытие по нажатию клавиши R (как в настоящем BSOD)
        document.addEventListener('keydown', function (e) {
            if (bsod.classList.contains('active')) {
                if (e.key === 'r' || e.key === 'R') {
                    hideBSOD();
                }
            }
        });

        // Закрытие по двойному нажатию на фон (опционально)
        bsod.addEventListener('dblclick', function (e) {
            if (e.target === bsod) {
                hideBSOD();
            }
        });
    });
    const cornerImg = document.getElementById('dynamicImg');
    if (cornerImg) {
        cornerImg.addEventListener('mouseenter', () => {
            cornerImg.src = 'img/girl1.png';  // Меняем при наведении
        });
    cornerImg.addEventListener('mouseleave', () => {
        cornerImg.src = 'img/girl2.png';    // Возвращаем обратно
    });
}

})();
