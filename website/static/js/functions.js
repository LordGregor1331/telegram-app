// Footer Navigation
const footerButtons = document.querySelectorAll('.footer-nav');
const sections = document.querySelectorAll('.section');

// Function to handle navigation
function handleNavigation(event) {
    // Remove 'active' class from all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove 'active' class from all footer buttons
    footerButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Get the ID of the clicked button
    const targetId = event.currentTarget.id;

    // Find the corresponding section
    const targetSection = document.getElementById(targetId.replace('-button', '-page'));

    // Add 'active' class to the target section and button
    targetSection.classList.add('active');
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
