// --- 1. Ваш існуючий код для Textarea (без змін) ---

const textarea = document.querySelector('.input-container textarea');
if (textarea) {
    const maxLines = 3;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || (14 * 1.4);
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);
    const maxHeight = (maxLines * lineHeight) + paddingTop + paddingBottom;

    function autoResize() {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        if (scrollHeight > maxHeight) {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        }
    }

    textarea.addEventListener('input', autoResize);
    autoResize();
}


// --- 2. Код для Слайдера/Галереї (ОНОВЛЕНО) ---

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.courses-wrapper');
    const dotsContainer = document.querySelector('.slider-dots');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const cards = document.querySelectorAll('.course-card');
    const btnLeft = document.querySelector('.button_left');
    const btnRight = document.querySelector('.button_right');

    if (!wrapper || !dotsContainer || !btnLeft || !btnRight || cards.length === 0) {
        console.warn('Slider elements not found. Slider script will not run.');
        return;
    }

    // --- Функції оновлення ---

    function updateActiveDot() {
        const scrollLeft = wrapper.scrollLeft;

        let closestIndex = 0;
        let minDiff = Infinity;

        // Знаходимо картку, лівий край якої НАЙБЛИЖЧЕ до лівого краю wrapper
        // Це набагато точніше для вашого типу слайдера
        cards.forEach((card, index) => {
            // card.offsetLeft - це позиція картки відносно wrapper
            const diff = Math.abs(card.offsetLeft - scrollLeft);

            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });

        // Оновлюємо класи
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === closestIndex);
        });
    }

    // Функція оновлення стану кнопок-стрілок (без змін, логіка коректна)
    function updateArrowStates() {
        const scrollLeft = wrapper.scrollLeft;
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

        // Допуск в 10px для надійності
        btnLeft.disabled = scrollLeft < 10;
        btnRight.disabled = (scrollLeft + 10) > maxScroll;
    }

    // --- Обробники подій ---

    btnRight.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(wrapper).gap);
        wrapper.scrollLeft += cardWidth + gap;
    });

    btnLeft.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(wrapper).gap);
        wrapper.scrollLeft -= cardWidth + gap;
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetCard = cards[index];
            if (targetCard) {
                wrapper.scrollTo({
                    left: targetCard.offsetLeft,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Оновлюємо стан кнопок та крапок під час будь-якого скролу
    let scrollTimer;
    wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        // !!! ЗМІНА ТУТ: Затримка зменшена до 50мс для швидшої реакції
        scrollTimer = setTimeout(() => {
            updateActiveDot();
            updateArrowStates();
        }, 50); // 50ms затримка (debounce) для оптимізації
    });

    // --- Ініціалізація ---
    updateActiveDot();
    updateArrowStates();
});