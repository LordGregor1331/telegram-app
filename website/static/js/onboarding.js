document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        document.getElementById('welcome-onboarding').classList.remove('active-onboarding-main');

        document.getElementById('onboarding-first-step').classList.add('active-onboarding-main');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Получаем все шаги онбординга
    const onboardingSteps = document.querySelectorAll('.onboarding-main');
    let currentStep = 0; // Индекс текущего шага (начинается с 0)

    // Получаем все кнопки «Next» и «Back»
    const nextButtons = document.querySelectorAll('.button-next');
    const backButtons = document.querySelectorAll('.button-back');

    // Функция для обновления отображения шагов
    function updateSteps() {
        onboardingSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active-onboarding-main');
            } else {
                step.classList.remove('active-onboarding-main');
            }
        });

        // Обновляем состояние кнопок «Back»
        backButtons.forEach(button => {
            if (currentStep === 0) {
                button.classList.add('button-back-inactive');
                button.style.pointerEvents = 'none'; // Отключаем клики
            } else {
                button.classList.remove('button-back-inactive');
                button.style.pointerEvents = 'auto'; // Включаем клики
            }
        });

        // Обновляем состояние кнопок «Next»
        nextButtons.forEach(button => {
            if (currentStep === onboardingSteps.length - 1) {
                button.textContent = 'Finish'; // Изменяем текст последней кнопки
            } else {
                button.textContent = 'Next';
            }
        });
    }

    // Инициализируем шаги при загрузке
    updateSteps();

    // Добавляем обработчики событий для кнопок «Next»
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep < onboardingSteps.length - 1) {
                currentStep++;
                updateSteps();
                console.log('Initialize')
            } else {
                // Действие при нажатии на «Finish»
                finishOnboarding();
            }
        });
    });

    // Добавляем обработчики событий для кнопок «Back»
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                updateSteps();
            }
        });
    });

    // Функция для завершения онбординга
    function finishOnboarding() {
        // Убираем класс 'active' у секции онбординга
        const onboardingSection = document.getElementById('onboarding-page');
        onboardingSection.classList.remove('active');

        // Добавляем класс 'active' к основной секции
        const mainPageSection = document.getElementById('main-page');
        mainPageSection.classList.add('active');

        // Дополнительно: можно добавить анимации или перенаправления
        console.log('Онбординг завершён.');
    }
});