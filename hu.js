document.addEventListener("DOMContentLoaded", () => {
    // --- НАСТРОЙКИ ---
    const config = {
        // Укажи здесь свои UTM-метки, при которых бот должен срабатывать
        utm: { 
            'utm_source': 'yandex', 
            'utm_medium': 'organic' 
        }, 
        behavior: {
            minSessionTime: 15000, // Минимум 15 сек "чтения" перед кликом
            maxSessionTime: 30000, // Максимум 30 сек
            scrollSpeed: 10,       // Базовая скорость скролла
            jitters: 3,            // Сила дрожания мыши (пиксели)
        },
        debug: false // Поставь true, чтобы видеть красный курсор (для тестов)
    };

    // Глобальное состояние
    const state = {
        startTime: Date.now(),
        isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
        cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    };

    // --- INIT ---
    function init() {
        const q = new URLSearchParams(window.location.search);
        // Проверка UTM (если метки не совпадают — бот не запускается)
        if (config.utm.utm_source && q.get('utm_source') !== config.utm.utm_source) return;

        if (config.debug) createDebugCursor();

        console.log("🤖 [NeuroBot] Сессия запущена. Режим:", state.isMobile ? "Mobile" : "Desktop");
        
        runLifecycle();
    }

    async function runLifecycle() {
        // 1. Фаза "Ориентация" (бот осматривается 1-3 сек)
        await wait(random(1000, 3000));
        
        // 2. Фаза "Потребление контента" (Скролл, чтение)
        const readTime = random(config.behavior.minSessionTime, config.behavior.maxSessionTime);
        await simulateReadingSession(readTime);

        // 3. Фаза "Поиск цели" (умный выбор без картинок)
        let target = findWeightedTarget();
        
        // Если цель не найдена сразу (SPA/React), ждем через Observer
        if (!target) {
            console.log("👀 [NeuroBot] Цель не найдена, жду появления контента...");
            target = await waitForContent();
        }

        if (!target) {
            console.log("🛑 [NeuroBot] Подходящих кнопок нет. Выход.");
            return;
        }

        console.log("🎯 [NeuroBot] Цель выбрана:", target);

        // 4. Фаза "Действие"
        await smartScrollTo(target);
        
        if (state.isMobile) {
            await mobileTapSequence(target);
        } else {
            await desktopClickSequence(target);
        }
    }

    // --- ЛОГИКА ЧТЕНИЯ ---
    async function simulateReadingSession(duration) {
        const endTime = Date.now() + duration;
        console.log(`📖 [NeuroBot] Имитация чтения ${Math.round(duration/1000)} сек...`);

        while (Date.now() < endTime) {
            // 70% шанс проскроллить вниз
            if (Math.random() < 0.7) {
                const amount = random(150, 500);
                await smoothScrollBy(amount);
            } 
            // 20% шанс вернуться чуть вверх (перечитывание)
            else if (Math.random() < 0.2) {
                await smoothScrollBy(-random(50, 150));
            }

            // 50% шанс паузы на чтение
            if (Math.random() < 0.5) {
                const pause = random(1000, 4000);
                if (!state.isMobile) await idleMouseMovement(pause);
                else await wait(pause);
            }
        }
    }

    // --- ЛОГИКА ПОИСКА ЦЕЛИ (БЕЗ КАРТИНОК) ---
    function findWeightedTarget() {
        // Ищем ссылки, кнопки и инпуты
        const candidates = Array.from(document.querySelectorAll('a[href], button, input[type="submit"], [role="button"]'));
        
        const scored = candidates.map(el => {
            const rect = el.getBoundingClientRect();
            let score = 0;

            // --- ФИЛЬТРЫ (ОТСЕВ) ---
            if (rect.width < 20 || rect.height < 20) return { el, score: -1 }; // Слишком мелкое
            if (window.getComputedStyle(el).visibility === 'hidden') return { el, score: -1 }; // Невидимое
            if (!el.offsetParent) return { el, score: -1 }; // Скрыто через display:none

            // ИСКЛЮЧЕНИЕ КАРТИНОК И БАННЕРОВ
            if (el.tagName === 'IMG') return { el, score: -1 };
            
            const innerImg = el.querySelector('img');
            if (innerImg) {
                // Если внутри ссылки есть картинка, проверяем её размер
                const imgRect = innerImg.getBoundingClientRect();
                const btnArea = rect.width * rect.height;
                const imgArea = imgRect.width * imgRect.height;
                
                // Если картинка занимает более 50% площади кнопки — считаем это баннером
                if (imgArea / btnArea > 0.5) return { el, score: -1 };
            }

            // --- НАЧИСЛЕНИЕ БАЛЛОВ ---
            
            // 1. Приоритет текстовым кнопкам
            const text = el.innerText.toLowerCase().trim();
            if (text.length === 0) score -= 500; // Пустые ссылки штрафуем

            // Ключевые слова (настраивайте под свой сайт)
            const keywords = ['купить', 'заказать', 'подробнее', 'корзина', 'скачать', 'читать', 'далее', 'вход', 'регистрация', 'получить'];
            if (keywords.some(w => text.includes(w))) {
                score += 2000; // Огромный приоритет
            }

            // 2. Центр экрана важнее подвала
            const centerY = rect.top + rect.height / 2;
            const screenCenter = window.innerHeight / 2;
            const distFromCenter = Math.abs(centerY - screenCenter);
            score += (1000 - distFromCenter) / 5; 

            // 3. Размер (умеренно важно)
            score += (rect.width * rect.height) / 5000; 

            // Штраф за слишком длинный текст (целые абзацы ссылкой)
            if (text.length > 150) score -= 300;

            return { el, score };
        }).filter(item => item.score > 0);

        if (scored.length === 0) return null;

        // Сортируем по убыванию очков
        scored.sort((a, b) => b.score - a.score);
        
        // Берем топ-3 лучших кнопки и выбираем случайно
        const topCandidates = scored.slice(0, 3);
        const winner = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        
        return winner.el;
    }

    function waitForContent() {
        return new Promise(resolve => {
            const observer = new MutationObserver((mutations, obs) => {
                const target = findWeightedTarget();
                if (target) {
                    obs.disconnect();
                    resolve(target);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, 10000); // Ждем максимум 10 сек
        });
    }

    // --- ФИЗИКА ДВИЖЕНИЯ (DESKTOP) ---
    async function desktopClickSequence(target) {
        const rect = target.getBoundingClientRect();
        // Целимся случайно внутрь кнопки
        const endX = rect.left + rect.width * random(0.2, 0.8);
        const endY = rect.top + rect.height * random(0.2, 0.8);

        // 1. Движение к цели (Кривая Безье + Шум)
        await moveMouseHuman(endX, endY);

        // 2. Пауза (Hover)
        dispatch(target, 'mouseover', endX, endY);
        await wait(random(150, 400));

        // 3. Фокус (важно для аналитики)
        target.focus({ preventScroll: true });

        // 4. Нажатие (MouseDown)
        dispatch(target, 'mousedown', endX, endY);
        
        // 5. Удержание (Hold)
        await wait(random(80, 200));
        
        // 6. Отпускание (MouseUp)
        dispatch(target, 'mouseup', endX, endY);

        // 7. Клик (Нативный)
        try {
            target.click(); // Самый надежный способ
        } catch(e) {
            dispatch(target, 'click', endX, endY);
        }
    }

    function moveMouseHuman(targetX, targetY) {
        return new Promise(resolve => {
            const startX = state.cursor.x;
            const startY = state.cursor.y;
            const path = generateHumanPath(startX, startY, targetX, targetY);

            let i = 0;
            function step() {
                if (i >= path.length) {
                    resolve();
                    return;
                }
                const p = path[i];
                state.cursor.x = p.x;
                state.cursor.y = p.y;
                
                if (config.debug) updateDebugCursor(p.x, p.y);

                const elUnder = document.elementFromPoint(p.x, p.y);
                dispatch(elUnder || document.body, 'mousemove', p.x, p.y);

                i++;
                requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    function generateHumanPath(x1, y1, x2, y2) {
        const points = [];
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.floor(dist / 5) + 25; 

        const cp1x = x1 + (x2 - x1) * 0.4 + random(-50, 50);
        const cp1y = y1 + (y2 - y1) * 0.1 + random(-50, 50);

        for (let t = 0; t <= 1; t += 1/steps) {
            const ease = 1 - Math.pow(1 - t, 3);
            let x = Math.pow(1-ease, 2) * x1 + 2*(1-ease)*ease * cp1x + ease*ease * x2;
            let y = Math.pow(1-ease, 2) * y1 + 2*(1-ease)*ease * cp1y + ease*ease * y2;

            // Дрожание
            x += (Math.random() - 0.5) * config.behavior.jitters;
            y += (Math.random() - 0.5) * config.behavior.jitters;

            points.push({x, y});
        }
        return points;
    }

    // --- МОБИЛЬНАЯ ВЕРСИЯ ---
    async function mobileTapSequence(target) {
        console.log("📱 Mobile tap sequence");
        dispatch(target, 'touchstart');
        await wait(random(50, 150));
        dispatch(target, 'touchend');
        target.click();
    }

    // --- УТИЛИТЫ ---
    async function smoothScrollBy(amount) {
        const startY = window.scrollY;
        const steps = 30;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            window.scrollTo(0, startY + (amount * ease));
            await wait(10);
        }
    }

    async function smartScrollTo(el) {
        const rect = el.getBoundingClientRect();
        // Если элемент уже в центре экрана - не скроллим
        if (rect.top >= 100 && rect.bottom <= window.innerHeight - 100) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(random(1000, 2000));
    }

    async function idleMouseMovement(duration) {
        const start = Date.now();
        while (Date.now() - start < duration) {
            if (Math.random() < 0.1) { // Редкие подергивания
                const x = state.cursor.x + random(-10, 10);
                const y = state.cursor.y + random(-10, 10);
                moveMouseHuman(x, y);
            }
            await wait(200);
        }
    }

    function dispatch(el, type, x, y) {
        const evt = new MouseEvent(type, {
            view: window, bubbles: true, cancelable: true,
            clientX: x, clientY: y,
            screenX: x + window.screenX, screenY: y + window.screenY,
            buttons: (type === 'mousedown' || type === 'mouseup') ? 1 : 0
        });
        el.dispatchEvent(evt);
    }

    function random(min, max) { return Math.random() * (max - min) + min; }
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function createDebugCursor() {
        const div = document.createElement('div');
        div.id = 'bot-cursor';
        div.style.cssText = 'position:fixed; width:12px; height:12px; background:red; border-radius:50%; pointer-events:none; z-index:99999; transition: transform 0.05s linear; box-shadow: 0 0 5px rgba(0,0,0,0.5);';
        document.body.appendChild(div);
    }
    function updateDebugCursor(x, y) {
        const el = document.getElementById('bot-cursor');
        if (el) el.style.transform = `translate(${x}px, ${y}px)`;
    }
});
