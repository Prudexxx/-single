
    (function() {
        // ---------- НАСТРОЙКИ ----------
        // ЗАДАННЫЙ ВЕРНЫЙ ПАРОЛЬ (можно изменить на свой)
        const CORRECT_PASSWORD = "1234";     // <-- поменяйте на нужный пароль
        // Альтернативно: "admin" или "castle", но по заданию предлагается простой код
        // Для демонстрации используем "1234". Пользователь может ввести "1234" и получить доступ.

        // DOM элементы
        const lockButton = document.getElementById('lockBtn');
        const modalOverlay = document.getElementById('passwordModal');
        const passwordField = document.getElementById('passwordField');
        const submitBtn = document.getElementById('submitPasswordBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const errorMsgContainer = document.getElementById('modalErrorMsg');
        const secretInfoBlock = document.getElementById('secretInfoBlock');

        // Функция для показа модального окна
        function openModal() {
            // Очищаем предыдущие ошибки и поле ввода
            passwordField.value = '';
            errorMsgContainer.innerHTML = '';
            modalOverlay.classList.add('active');
            // Автофокус на поле ввода (небольшая задержка для корректной анимации)
            setTimeout(() => {
                passwordField.focus();
            }, 100);
        }

        // Функция закрытия модального окна (без проверки)
        function closeModal() {
            modalOverlay.classList.remove('active');
            errorMsgContainer.innerHTML = ''; // очищаем ошибку
        }

        // Функция отображения ошибки внутри модального окна
        function showError(message) {
            errorMsgContainer.innerHTML = `<div class="error-msg">⚠️ ${message}</div>`;
            passwordField.classList.add('error-shake');
            setTimeout(() => {
                passwordField.classList.remove('error-shake');
            }, 400);
            passwordField.value = '';
            passwordField.focus();
        }

        // Проверка пароля и, если успешно: закрыть модалку, показать блок информации
        function verifyAndUnlock() {
            const enteredPassword = passwordField.value.trim();
            if (enteredPassword === "") {
                showError("Пароль не может быть пустым!");
                return;
            }
            
            if (enteredPassword === CORRECT_PASSWORD) {
                // ПАРОЛЬ ВЕРНЫЙ
                // 1. Закрыть модальное окно
                closeModal();
                // 2. Показать блок с внутренней информацией (если он еще не показан)
                if (secretInfoBlock.classList.contains('hidden-panel')) {
                    secretInfoBlock.classList.remove('hidden-panel');
                    secretInfoBlock.classList.add('visible-panel');
                } else {
                    // если уже видим, то можно легкий эффект "обновления" — например, перезапустить анимацию 
                    secretInfoBlock.style.animation = 'none';
                    secretInfoBlock.offsetHeight; // триггер reflow
                    secretInfoBlock.style.animation = 'fadeSlideUp 0.5s ease-out';
                }
                // Доп. фишка: после успешного открытия можно вывести сообщение в консоль, но необязательно
                console.log("🔓 Доступ получен! Информация разблокирована.");
            } else {
                // Неверный пароль
                showError("Неверный пароль. Попробуйте ещё раз.");
            }
        }

        // Обработчик нажатия на кнопку с замком — открывает окно запроса пароля
        lockButton.addEventListener('click', openModal);

        // Обработчик кнопки подтверждения пароля
        submitBtn.addEventListener('click', verifyAndUnlock);

        // Закрытие по кнопке "Отмена"
        closeModalBtn.addEventListener('click', closeModal);

        // Закрытие модального окна при клике на фон (overlay), но не на саму карточку
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        // Добавим обработку нажатия клавиши Enter в поле ввода пароля
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyAndUnlock();
            }
        });

        // Небольшой эффект для кнопки — убираем возможные баги с фокусом на мобилках
        // Также заранее гарантируем, что блок информации скрыт при загрузке (атрибуты уже есть)
        // Дополнительно: если пользователь когда-либо разблокировал, блок остается видимым даже после перезагрузки?
        // По заданию: если введен верный — открывается ниже окно с описанием. После разблокировки блок остается.
        // При перезагрузке страницы блок снова скроется (так как состояние не сохраняется). Так и задумано.
        // Для удобства: secretInfoBlock изначально скрыт (hidden-panel). 
        // Также можно добавить сброс, чтобы при неудачном вводе не возникало артефактов.
        
        // Доп. опция: если блок уже виден, повторное нажатие на замок все равно открывает модалку, но если ввести
        // любой пароль (даже верный) он просто закроет окно и блок уже и так показан, ничего не сломается)
        // Пользовательский опыт: кнопка работает предсказуемо.
        
        // На случай если приложение используется в iframe или особых средах, подстрахуем стили для ошибки
        const styleShake = document.createElement('style');
        styleShake.textContent = `
            .error-shake {
                animation: shakeErr 0.3s ease-in-out 0s 2;
                border-color: #c73d2f !important;
            }
            @keyframes shakeErr {
                0% { transform: translateX(0); }
                25% { transform: translateX(-6px); }
                75% { transform: translateX(6px); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(styleShake);
        
        // Также можно обработать ситуацию, если блок информации уже видим и пользователь снова 
        // вводит пароль верный — закроем модалку без лишних действий (уже видно описание).
        // Функция verifyAndUnlock уже делает проверку — если блок уже показан и пароль верный, просто закроет окно.
        // Более того, если блок показан, но вы хотите его скрыть? нет условий, по заданию при верном пароле он должен стать видимым.
        // Если он видим, повторная верификация ничего не ломает, даже анимацию перезапускаем.
        // Отлично.
        
        // ПО ЖЕЛАНИЮ, можно добавить автоматический сброс блока, если нужен повторный ввод? не требуется.
        // Все соответствует: одна кнопка всегда на всех экранах по центру + рисунок замка + модальное окно + ниже описание.
        
        // Для идеальной адаптации под любой размер экрана: wrapper центрируется, body выравнивает.
        // Доп. фича: если вдруг пользователь хочет скрыть информацию, но по ТЗ не требуется, мы не добавляем лишних кнопок.
        
        // Демонстрационные данные в блоке информации — "внутренняя информация" полностью раскрыта.
        // Легко можно изменить пароль, поменяв константу CORRECT_PASSWORD.
        // Текущий пароль: 1234. При вводе "1234" открывается панель с описанием.
    })();
