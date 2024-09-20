document.addEventListener('DOMContentLoaded', function () {
    // Get the main elements
    const storageImage = document.querySelector('.storage img');
    const balanceDisplay = document.querySelector('#egg-capacity span');
    let balance = parseInt(balanceDisplay.textContent.replace(/,/g, ''));

    // Function to format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to create and animate the "+1" text
    function showPlusOne(event) {
        const plusOne = document.createElement('div');
        plusOne.textContent = "+12";
        plusOne.className = "plus-one";
        plusOne.style.position = "absolute";
        plusOne.style.left = `${event.clientX}px`;
        plusOne.style.top = `${event.clientY}px`;
        document.body.appendChild(plusOne);

        // Animate the "+1"
        plusOne.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(-50px)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });

        setTimeout(() => {
            plusOne.remove();
        }, 800);
    }

    // Function to update the balance
    function updateBalance() {
        balance += 12;
        balanceDisplay.textContent = formatNumber(balance);
    }

    // Function to animate the storage image
    function animateStorageImage() {
        storageImage.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0px)' }
        ], {
            duration: 300,
            easing: 'ease-in-out'
        });
    }

    // Add the click event listener to the storage image
    storageImage.addEventListener('click', function (event) {
        showPlusOne(event);
        updateBalance();
        animateStorageImage();
    });
});
