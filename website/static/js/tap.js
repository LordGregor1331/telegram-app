// tap.js
document.addEventListener('DOMContentLoaded', function () {
    // Constants
    const eggsToCoinPrice = 1500; // Must match the server-side value

    // Select elements
    const eggBalanceElements = document.querySelectorAll('.egg-balance');
    const storageMaxElements = document.querySelectorAll('.storage-max');
    const foodBalanceElement = document.querySelector('#energy-capacity span'); // Assuming this is unique
    const earnPerTapElement = document.querySelector('.earn-per-tap'); // Assuming this is unique
    const tokenBalanceElements = document.querySelectorAll('.token-balance');

    // Debugging: Log selected elements
    console.log("Egg Balance Elements:", eggBalanceElements);
    console.log("Storage Max Elements:", storageMaxElements);
    console.log("Food Balance Element:", foodBalanceElement);
    console.log("Earn Per Tap Element:", earnPerTapElement);
    console.log("Token Balance Elements:", tokenBalanceElements);

    // Ensure required elements are present
    if (!eggBalanceElements.length || !earnPerTapElement || !tokenBalanceElements.length) {
        console.error("Required elements not found in the DOM.");
        return;
    }

    // Initialize balances by parsing the text content
    let eggBalance = parseFloat(eggBalanceElements[0].textContent.replace(/,/g, '').replace('+', ''));
    let foodBalance = foodBalanceElement ? parseFloat(foodBalanceElement.textContent.split('/')[0].replace(/,/g, '')) : 100; // Default value if not present
    const storageMaxVolume = foodBalanceElement ? parseFloat(foodBalanceElement.textContent.split('/')[1].replace(/,/g, '')) : 5000; // Default value if not present
    const earnPerTap = parseFloat(earnPerTapElement.textContent.replace('+', '').replace(/,/g, ''));

    // Debugging: Log initial values
    console.log("Initial Egg Balance:", eggBalance);
    console.log("Initial Food Balance:", foodBalance);
    console.log("Storage Max Volume:", storageMaxVolume);
    console.log("Earn Per Tap:", earnPerTap);

    // Function to format numbers with commas and fixed decimals
    function formatNumber(num, decimals=0) {
        return num.toLocaleString(undefined, {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
    }

    // Function to create and animate the "+X" text
    function showPlusText(event, amount) {
        const plusText = document.createElement('div');
        plusText.textContent = `+${amount}`;
        plusText.className = "plus-one";
        plusText.style.position = "absolute";
        plusText.style.left = `${event.clientX}px`;
        plusText.style.top = `${event.clientY}px`;
        plusText.style.pointerEvents = "none";
        plusText.style.color = "green"; // Customize as needed
        plusText.style.fontWeight = "bold";
        plusText.style.fontSize = "16px";
        document.body.appendChild(plusText);

        // Animate the "+X"
        plusText.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(-50px)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });

        setTimeout(() => {
            plusText.remove();
        }, 800);
    }

    // Function to update the balance displays
    function updateDisplays(newEggBalance, newFoodBalance) {
        // Update egg balance elements
        eggBalanceElements.forEach(function(elem) {
            elem.textContent = `${formatNumber(newEggBalance, 0)}`;
        });

        // Update food balance element
        if (foodBalanceElement) {
            foodBalanceElement.textContent = `${formatNumber(newFoodBalance, 0)}/${formatNumber(storageMaxVolume, 0)}`;
        }

        // Calculate and update token balance
        const tokens = newEggBalance / eggsToCoinPrice;
        tokenBalanceElements.forEach(function(elem) {
            elem.textContent = `${formatNumber(tokens, 2)}`; // 2 decimal places
        });
    }

    // Function to animate the storage image
    function animateStorageImage() {
        const storageImage = document.querySelector('.storage img');
        if (storageImage) {
            storageImage.animate([
                { transform: 'translateY(0px)' },
                { transform: 'translateY(-10px)' },
                { transform: 'translateY(0px)' }
            ], {
                duration: 300,
                easing: 'ease-in-out'
            });
        }
    }

    // Function to handle the tap action
    async function handleTap(event) {
        // Prevent multiple taps if a tap is already in progress
        if (handleTap.isProcessing) return;
        handleTap.isProcessing = true;

        // Check if food balance is sufficient
        if (foodBalance <= 0) {
            alert("No food balance left! You cannot tap.");
            handleTap.isProcessing = false;
            return;
        }

        // Check if storage can accommodate more eggs
        if (eggBalance + earnPerTap > storageMaxVolume) {
            alert("Storage is full! Upgrade your storage to tap more.");
            handleTap.isProcessing = false;
            return;
        }

        try {
            const response = await fetch('/tap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (response.ok) {
                const data = await response.json();
                eggBalance = data.egg_balance;
                foodBalance = data.food_balance;
                updateDisplays(eggBalance, foodBalance);
                showPlusText(event, data.earn_per_tap);
                animateStorageImage();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "An error occurred.");
            }
        } catch (error) {
            console.error("Error during tap:", error);
            alert("An error occurred while processing your tap.");
        } finally {
            handleTap.isProcessing = false;
        }
    }

    // Add the click event listener to the storage image
    const storageImage = document.querySelector('.storage img');
    if (storageImage) {
        storageImage.addEventListener('click', handleTap);
    } else {
        console.error("Storage image not found. Tap event listener not attached.");
    }
});
