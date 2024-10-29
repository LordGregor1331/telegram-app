// Footer Navigation
const footerButtons = document.querySelectorAll('.footer-nav');
const sections = document.querySelectorAll('.section');

// Function to handle navigation
function handleNavigation(event) {
    const targetId = event.currentTarget.id;
    const targetSection = document.getElementById(targetId.replace('-button', '-page'));

    // Найти активную секцию
    const activeSection = document.querySelector('.section.active');

    if (activeSection) {
        // Текущая секция просто скрывается без анимации
        activeSection.classList.remove('active');
        activeSection.style.display = 'none'; // Скрыть текущую секцию
    }

    // Показать новую секцию
    targetSection.style.display = 'flex'; // Показать новую секцию
    targetSection.classList.add('active');
    targetSection.style.animation = 'fade-in 0.5s forwards';

    // Обновить классы на кнопках
    footerButtons.forEach(button => {
        button.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Add click event listeners to footer buttons
footerButtons.forEach(button => {
    button.addEventListener('click', handleNavigation);
});

// Storage Energy Switch
document.getElementById('energy-switch-chicken').addEventListener('click', function () {
    document.getElementById('energy-switch-chicken').classList.add('storage-switch-active');
    document.getElementById('energy-switch-energy').classList.remove('storage-switch-active');
    document.getElementById('buy-chicken-section').classList.add('energy-switch-switcher-active');
    document.getElementById('buy-energy-section').classList.remove('energy-switch-switcher-active');
});

document.getElementById('energy-switch-energy').addEventListener('click', function () {
    document.getElementById('energy-switch-energy').classList.add('storage-switch-active');
    document.getElementById('energy-switch-chicken').classList.remove('storage-switch-active');
    document.getElementById('buy-energy-section').classList.add('energy-switch-switcher-active');
    document.getElementById('buy-chicken-section').classList.remove('energy-switch-switcher-active');
});

// Chicken Market Switch
document.getElementById('chickens-market').addEventListener('click', function () {
    document.getElementById('chickens-market').classList.add('chicken-market-switch-active');
    document.getElementById('my-chickens').classList.remove('chicken-market-switch-active');
    document.getElementById('market').classList.add('chicken-market-active');
    document.getElementById('chicken-sell').classList.remove('chicken-market-active');
});

document.getElementById('my-chickens').addEventListener('click', function () {
    document.getElementById('my-chickens').classList.add('chicken-market-switch-active');
    document.getElementById('chickens-market').classList.remove('chicken-market-switch-active');
    document.getElementById('chicken-sell').classList.add('chicken-market-active');
    document.getElementById('market').classList.remove('chicken-market-active');
});

// Input Quantity Buy + -
document.addEventListener("DOMContentLoaded", function () {
    const minusButton = document.getElementById("market-buy-minus");
    const plusButton = document.getElementById("market-buy-plus");
    const inputField = document.querySelector(".quantity-form input[type='number']");

    // Set initial value if not set
    if (!inputField.value) {
        inputField.value = 1;
    }

    minusButton.addEventListener("click", function () {
        let currentValue = parseInt(inputField.value, 10);
        if (!isNaN(currentValue) && currentValue > 0) {
            inputField.value = currentValue - 1;
        }
    });

    plusButton.addEventListener("click", function () {
        let currentValue = parseInt(inputField.value, 10);
        if (!isNaN(currentValue)) {
            inputField.value = currentValue + 1;
        }
    });
});

// Input Quantity Sell + -
document.addEventListener("DOMContentLoaded", function () {
    const minusButton = document.querySelector(".market-sell-minus");
    const plusButton = document.querySelector(".market-sell-plus");
    const inputField = document.querySelector(".sell-quantity-form input[type='number']");

    if (!inputField.value) {
        inputField.value = 1;
    }
    minusButton.addEventListener("click", function () {
        let currentValue = parseInt(inputField.value, 10);
        if (!isNaN(currentValue) && currentValue > 0) {
            inputField.value = currentValue - 1;
        }
    });
    plusButton.addEventListener("click", function () {
        let currentValue = parseInt(inputField.value, 10);
        if (!isNaN(currentValue)) {
            inputField.value = currentValue + 1;
        }
    });
});

// Popup Buy Open
document.querySelectorAll('.buy-button').forEach(function (button) {
    button.addEventListener('click', function () {
        console.log('Button clicked');
        if (window.innerWidth <= 480) {
            document.querySelector('.popup-market-buy').classList.add('popup-active');
            document.querySelector('#storage-page footer').style.display = 'none';
        }
    });
});

// Popup Buy Close
document.querySelector('.popup-market-buy .cross-exit').addEventListener('click', function () {
    document.querySelector('.popup-market-buy').classList.remove('popup-active');
    document.querySelector('#storage-page footer').style.display = 'flex';
});

// Popup Sell Open
document.querySelectorAll('.sell-button').forEach(function (button) {
    button.addEventListener('click', function () {
        if (window.innerWidth <= 480) {
            document.querySelector('.popup-market-sell').style.display = 'block';
            document.querySelector('#storage-page footer').style.display = 'none';
        }
    });
});

// Popup Sell Close
document.querySelector('.popup-market-sell .cross-exit').addEventListener('click', function () {
    document.querySelector('.popup-market-sell').style.display = 'none';
    document.querySelector('#storage-page footer').style.display = 'flex';
});

// Popup Social Open
document.addEventListener('DOMContentLoaded', function () {
    let socialPopupOpen = document.querySelector('.task-container.social-popup-open');
    let popupJoinSocial = document.querySelector('.popup.popup-join-social');
    let earnPageFooter = document.querySelector('#earn-page footer');

    if (socialPopupOpen && popupJoinSocial && earnPageFooter) {
        socialPopupOpen.addEventListener('click', function () {
            // Add 'popup-active' class to the popup
            popupJoinSocial.classList.add('popup-active');

            // Hide the footer
            earnPageFooter.style.display = 'none';
        });
    }
});

// Popup Social Close
document.addEventListener('DOMContentLoaded', function () {
    let popupJoinSocial = document.querySelector('.popup.popup-join-social');
    let crossExit = document.querySelector('.popup.popup-join-social .cross-exit');
    let earnPageFooter = document.querySelector('#earn-page footer');

    if (popupJoinSocial && crossExit && earnPageFooter) {
        crossExit.addEventListener('click', function () {
            // Remove 'popup-active' class from the popup
            popupJoinSocial.classList.remove('popup-active');

            // Show the footer
            earnPageFooter.style.display = '';
        });
    }
});

// Invite Friends Section
document.getElementById('invite-friends').addEventListener('click', function () {
    document.getElementById('earn-page-secondarycontent').classList.add('active-main');
    document.getElementById('earn-page-maincontent').classList.remove('active-main');
});

// Buy NFT Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Click on "My NFT's"
    document.getElementById('my-nft-nav').addEventListener('click', function() {
        // Remove 'active-main' from 'buy-nft' and add to 'my-nft'
        document.getElementById('buy-nft').classList.remove('active-main');
        document.getElementById('my-nft').classList.add('active-main');

        // Toggle active navigation
        document.querySelector('.nft-navpoint-active').classList.remove('nft-navpoint-active');
        this.classList.add('nft-navpoint-active');
    });

    // Click on "New"
    document.getElementById('new-nft-nav').addEventListener('click', function() {
        // Remove 'active-main' from 'my-nft' and add to 'buy-nft'
        document.getElementById('my-nft').classList.remove('active-main');
        document.getElementById('buy-nft').classList.add('active-main');

        // Toggle active navigation
        document.querySelector('.nft-navpoint-active').classList.remove('nft-navpoint-active');
        this.classList.add('nft-navpoint-active');
    });
});

// All NFT Switch
document.addEventListener('DOMContentLoaded', function() {
    // Click on "All NFT's"
    document.getElementById('all-nft').addEventListener('click', function() {
        // Remove 'nftmarket-active' from 'limited-nft' and add to 'all-nft'
        document.querySelector('.limited-nft').classList.remove('nftmarket-active');
        document.querySelector('.all-nft').classList.add('nftmarket-active');

        // Toggle active navigation
        document.querySelector('.buy-nft-switch-active').classList.remove('buy-nft-switch-active');
        this.classList.add('buy-nft-switch-active');
    });

    // Click on "Limited NFT's"
    document.getElementById('limited-nft').addEventListener('click', function() {
        // Remove 'nftmarket-active' from 'all-nft' and add to 'limited-nft'
        document.querySelector('.all-nft').classList.remove('nftmarket-active');
        document.querySelector('.limited-nft').classList.add('nftmarket-active');

        // Toggle active navigation
        document.querySelector('.buy-nft-switch-active').classList.remove('buy-nft-switch-active');
        this.classList.add('buy-nft-switch-active');
    });
});

//navpoint for wallet-page
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для каждого элемента навигации
    function handleNavigationClick(navId, containerId) {
        // Скрываем все блоки с классом .wallet-income внутри <main>
        document.querySelectorAll('.wallet-income').forEach(container => {
            container.style.display = 'none';
        });

        // Показываем только выбранный блок с классом .wallet-income
        const targetContainer = document.getElementById(containerId);
        if (targetContainer) {
            targetContainer.style.display = 'block';
        }

        // Переключаем активный класс для навигации
        document.querySelector('.wallet-navpoint-active').classList.remove('wallet-navpoint-active');
        document.getElementById(navId).classList.add('wallet-navpoint-active');
    }

    // Клик на "Overview"
    document.getElementById('overview-nav').addEventListener('click', function() {
        handleNavigationClick('overview-nav', 'wallet-general-content');
    });

    // Клик на "Storage"
    document.getElementById('storage-nav').addEventListener('click', function() {
        handleNavigationClick('storage-nav', 'wallet-storage-content');
    });

    // Клик на "Referal"
    document.getElementById('referal-nav').addEventListener('click', function() {
        handleNavigationClick('referal-nav', 'wallet-referal-content');
    });
});

//deposit_page.html
//open list
document.addEventListener('DOMContentLoaded', function() {
    // Выбираем все элементы с классами USDT, TON и FIAT
    document.querySelectorAll('.USDT-deposit-details, .TON-deposit-details, .FIAT-deposit-details').forEach(function(detailButton) {
        detailButton.addEventListener('click', function() {
            // Находим контент и стрелку внутри текущего блока
            var content = this.nextElementSibling; // Предполагаем, что content находится сразу после кнопки
            var arrow = this.querySelector('.arrow'); // Находим стрелку внутри нажатой кнопки

            // Проверяем, открыт ли контент
            if (content.classList.contains('open')) {
                content.classList.remove('open');
                arrow.classList.remove('open');
            } else {
                content.classList.add('open');
                arrow.classList.add('open');
            }
        });
    });
});

//ton usdt navigation
document.querySelector('#USDT').addEventListener('click', function() {
    document.getElementById('TON-deposit').classList.remove('active-main');
    document.getElementById('USDT-deposit').classList.add('active-main');
    document.getElementById('USDT').classList.add('currency-type-active');
    document.getElementById('TON').classList.remove('currency-type-active');
});

document.querySelector('#TON').addEventListener('click', function() {
    document.getElementById('USDT-deposit').classList.remove('active-main');
    document.getElementById('TON-deposit').classList.add('active-main');
    document.getElementById('TON').classList.add('currency-type-active');
    document.getElementById('USDT').classList.remove('currency-type-active');
});

//crypto fiat navigation
document.getElementById('fiat').addEventListener('click', function () {
    document.getElementById('fiat-deposit').classList.add('active-main')
    document.getElementById('crypto-deposit').classList.remove('active-main')
    document.getElementById('fiat').classList.add('deposit-navpoint-active')
    document.getElementById('crypto').classList.remove('deposit-navpoint-active')
})
document.getElementById('crypto').addEventListener('click', function() {
    document.getElementById('crypto-deposit').classList.add('active-main')
    document.getElementById('fiat-deposit').classList.remove('active-main')
    document.getElementById('fiat').classList.remove('deposit-navpoint-active')
    document.getElementById('crypto').classList.add('deposit-navpoint-active')
})

//currency switch with API
document.addEventListener('DOMContentLoaded', function() {
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        UAH: '₴',
        RUB: '₽'
    };

    const currencyNames = {
        USD: 'USD',
        EUR: 'EUR',
        UAH: 'UAH',
        RUB: 'RUB'
    };

    async function getExchangeRate(currency) {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currency.toLowerCase()}`);
        const data = await response.json();
        return data.tether[currency.toLowerCase()];
    }

    async function updateCurrency(currency) {
        const currencySwitch = document.querySelector('.currency-type-switch');
        const currencyIcon = document.querySelector('.currency-type-switch-icon');
        const currencyNumb = document.querySelector('.currency-type-switch-numb');

        if (currencySwitch && currencyIcon && currencyNumb) {
            currencySwitch.classList.add('hidden');
            currencyIcon.classList.add('hidden');
            currencyNumb.classList.add('hidden');

            const exchangeRate = await getExchangeRate(currency);

            setTimeout(function() {
                currencySwitch.textContent = currencyNames[currency];
                currencyIcon.textContent = currencySymbols[currency];
                currencyNumb.textContent =  (exchangeRate * 7).toFixed(2);

                currencySwitch.classList.remove('hidden');
                currencyIcon.classList.remove('hidden');
                currencyNumb.classList.remove('hidden');
            }, 500);
        } else {
            console.error("Элементы .currency-type-switch, .currency-type-switch-icon или .currency-type-switch-numb не найдены.");
        }
    }

    updateCurrency('USD');

    document.querySelectorAll('.currency-type').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.currency-type').forEach(btn => btn.classList.remove('currency-type-active'));

            this.classList.add('currency-type-active');

            updateCurrency(this.id);
        });
    });
});

//transaction-history-show
document.getElementById('transaction-history-switcher').addEventListener('click', function () {
    document.getElementById('wallet-page').classList.remove('active')
    document.getElementById('transaction-history-page').classList.add('active')
})

//deposit-page-switcher
document.getElementById('deposit-page-switcher').addEventListener('click', function() {
    document.getElementById('wallet-page').classList.remove('active')
    document.getElementById('deposit-page').classList.add('active')
})

//withdraw-page popup show
document.addEventListener('DOMContentLoaded', function() {
    const withdrawButton = document.querySelector('.submit');
    const popup = document.getElementById('withdraw-popup');
    const mainSection = document.getElementById('withdraw-address');

    function showPopup() {
        // Скрыть основную секцию
        mainSection.classList.add('hide');
        mainSection.classList.remove('show');

        // Показать попап
        popup.classList.add('show');
        popup.classList.remove('hide');

        // Через 10 секунд скрыть попап и показать основную секцию
        setTimeout(hidePopup, 5000);
    }

    function hidePopup() {
        // Скрыть попап
        popup.classList.add('hide');
        popup.classList.remove('show');

        // Показать основную секцию
        mainSection.classList.add('show');
        mainSection.classList.remove('hide');
    }

    // Событие клика по кнопке "Withdraw"
    withdrawButton.addEventListener('click', function() {
        showPopup();
    });

    // Событие клика по любому месту на экране
    document.addEventListener('click', function(e) {
        if (e.target !== withdrawButton) {
            showPopup();
        }
    });

    // Скрыть попап немедленно при клике на попап
    popup.addEventListener('click', hidePopup);
});

//energy input on storage-page.html
const energyInput = document.getElementById('energy-input');
const energyCost = document.getElementById('energy-cost');
function calculateEnergyCost() {
    const energyAmount = parseInt(energyInput.value) || 0;
    const tokenCost = energyAmount * 27;
    energyCost.textContent = tokenCost;
}
energyInput.addEventListener('input', calculateEnergyCost);

//show/hide energy input
document.addEventListener('DOMContentLoaded', function() {
    const toggleArrow = document.getElementById('toggle-arrow');
    const energyBoostContainers = document.querySelectorAll('.energy-boost');

    let isOpen = false;

    toggleArrow.addEventListener('click', function() {
        isOpen = !isOpen;

        if (isOpen) {
            toggleArrow.src = "../static/img/button raise down.png";

            // Плавно раскрыть блоки
            energyBoostContainers.forEach(container => {
                container.classList.remove('hide');
                container.style.display = 'flex';
                container.classList.add('show');
            });

        } else {
            toggleArrow.src = "../static/img/button raise up.png";

            // Плавно скрыть блоки
            energyBoostContainers.forEach(container => {
                container.classList.remove('show');
                container.classList.add('hide');

                setTimeout(() => {
                    container.style.display = 'none';
                }, 500);
            });
        }
    });
});
//show/hide energy limit
document.addEventListener('DOMContentLoaded', function() {
    const toggleArrowLimit = document.getElementById('toggle-arrow-limit');
    const energyLimitContainer = document.querySelector('.energy-limit-container');
    let isOpen = false;
    toggleArrowLimit.addEventListener('click', function () {
        isOpen = !isOpen
        if (isOpen) {
            toggleArrowLimit.src = "../static/img/button raise down.png";
            energyLimitContainer.classList.remove('hide');
            energyLimitContainer.style.display = 'block';
            energyLimitContainer.classList.add('show');
        } else {
            toggleArrowLimit.src = "../static/img/button raise up.png";
            energyLimitContainer.classList.remove('show');
            energyLimitContainer.classList.add('hide');
            setTimeout(() => {
                energyLimitContainer.style.display = 'none';
            }, 500);
        }
    });
});

//show/hide eggs per tap
document.addEventListener('DOMContentLoaded', function () {
    const toggleArrowPerTap = document.getElementById('toggle-arrow-tap')
    const perTapContainer = document.querySelector('.eggs-per-tap-container')
    let isOpen = false
    toggleArrowPerTap.addEventListener('click', function () {
        isOpen = !isOpen
        if (isOpen) {
            toggleArrowPerTap.src = "../static/img/button raise down.png"
            perTapContainer.classList.remove('hide')
            perTapContainer.style.display = 'block'
            perTapContainer.classList.add('show')
        } else {
            toggleArrowPerTap.src = "../static/img/button raise up.png"
            perTapContainer.classList.remove('show')
            perTapContainer.classList.add('hide')
            setTimeout (() => {
                perTapContainer.style.display = 'none'
            }, 500)
        }
    })
})

//exchange-popup
document.addEventListener('DOMContentLoaded', () => {
    const popupExchange = document.querySelector('.popup-exchange');
    const popupOpenButton = document.getElementById('storage-change');
    const popupCloseButton = document.getElementById('popup-exchange-close');

    if (popupOpenButton && popupCloseButton && popupExchange) {
        popupOpenButton.addEventListener('click', () => {
            popupExchange.classList.add('popup-active');
        });
        popupCloseButton.addEventListener('click', () => {
            popupExchange.classList.remove('popup-active');
        });
    } else {
        console.error('One or more elements not found.');
    }
});

document.querySelector('.energy-container').addEventListener('click', function () {
    document.getElementById('storage-page').classList.add('active')
    document.getElementById('main-page').classList.remove('active')
})

//animation for reward

const getRewardButton = document.getElementById('get-reward');
const animatedToken = document.getElementById('animated-token');

// Функция для запуска анимации
function playTokenAnimation() {
    animatedToken.classList.add('active'); // Добавляем класс для запуска анимации

    // Удаляем класс через 5 секунд, чтобы можно было запустить анимацию снова
    setTimeout(() => {
        animatedToken.classList.remove('active');
    }, 5000);
}

// Добавляем обработчик клика на кнопку
getRewardButton.addEventListener('click', playTokenAnimation);