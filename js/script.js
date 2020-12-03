/*jshint -W030 */
// ---------------
// When Page Loads
function onPageLoad() {
    // ----------------
    // Global Variables
    const otherJob = document.querySelector('#other-job-role');
    const jobRole = document.querySelector('#title');
    const tshirtDesign = document.querySelector('#design');
    const tshirtColor = document.querySelector("#color");
    const tshirtColorItems = tshirtColor.querySelectorAll('option');
    const registerActivities = document.querySelector('#activities');
    const activities = registerActivities.querySelectorAll('[type="checkbox"]');
    const payment = document.querySelector('#payment');
    const form = document.querySelector('form');
    let totalCost = 0;

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const ccInput = document.querySelector('#cc-num');
    const ccZip = document.querySelector('#zip');
    const ccCCV = document.querySelector('#cvv');

    // --------------------------
    // Set initial element values
    function initializeForm() {
        // Reset Option Selections on Page Refresh
        tshirtDesign.selectedIndex = 0;
        tshirtColor.selectedIndex = 0;
        jobRole.selectedIndex = 0;
        payment.selectedIndex = 1; // Credit Card is default

        // Focus on the first text input
        document.querySelector('[name="user-name"]').focus();

        // Hide otherJobs and tshirtsColor display    
        otherJob.style.display = "none";
        tshirtColorItems.forEach(color => {
            color.style.display = "none";
        });

        // Uncheck all Registered Activities
        activities.forEach(activity => {
            activity.checked = false;
        });

        updatePaymentMethod();
    }
    
    // ----------------------
    // Update Payment Methods
    function updatePaymentMethod() {
        const paymentMethods = document.querySelectorAll('.payment-methods > div');
        paymentMethods.forEach(method => {
            const selectedPayment = payment.options[payment.selectedIndex].value;
            // Reset visibility of all payment methods
            method.style.display = '';
            // Hide payment methods that do not match selectedPayment
            if (method.className !== selectedPayment && method.className !== 'payment-method-box') {
                method.style.display = "none";
            }
        });
    }

    // -----------------------------
     // Submit Form & Validate Fields
     function submitForm() {
        isValidName();
     }

     function showOrHideToolTip(show, element) {
         if (show) {
            element.style.display = 'inherit';
         } else {
            element.style.display = 'none';
        }
    }

    function checkInput(validator) {
        return e => {
            const text = e.target.value;
            const valid = validator(text);
            const showTip = text !== '' && !valid;
            const tooltip = e.target.nextElementSibling;
            showOrHideToolTip(showTip, tooltip);
        };
    }

    // Validate Name Field
    const isValidName = name => /[^\s\d\W_][a-z A-Z]*$/.test(name);
    const isValidEmail = email => /[^\s\W][a-zA-Z-_\d]+@[a-zA-Z\d]+\.\w{3}$/.test(email);
    const isValidCC = cc => /^\d{13}\d?\d?\d?$/.test(cc);
    const isValidZip = zip => /^\d{5}$/.test(zip);
    const isValidCCV = ccv => /^\d{3}$/.test(ccv);

    nameInput.addEventListener('input', checkInput(isValidName));
    emailInput.addEventListener('input', checkInput(isValidEmail));
    ccInput.addEventListener('input', checkInput(isValidCC));
    ccZip.addEventListener('input', checkInput(isValidZip));
    ccCCV.addEventListener('input', checkInput(isValidCCV));

    // ------------------
    // On Job Role Change (if 'other' selected)
    jobRole.addEventListener('change', e => {
        const selectedJob = e.target.options[e.target.selectedIndex].value;
        // If the selected Job is "Other", reveal the Other input field
        selectedJob === 'other' ? otherJob.style.display = '' : otherJob.style.display = 'none';
    });

    // ------------------------
    // On T-Shirt Design Change
    tshirtDesign.addEventListener('change', e => {
        const selectedDesignTheme = e.target.options[e.target.selectedIndex].value;
        // On design list change, reset tshirtColor drop down list
        tshirtColor.selectedIndex = 0;
        // Loop through Tshirt colors
        for (let i = 0; i < tshirtColorItems.length; i++) {
            const colorOption = tshirtColorItems[i];
            const colorTheme = colorOption.getAttribute('data-theme');
            // If Tshirt Theme is the same as the selectedDesignTheme
            if (colorTheme === selectedDesignTheme) {
                // Set default t-shirt option relatived to selectedDesignTheme
                tshirtColor.selectedIndex = i - 2;
                colorOption.style.display = '';
            } else {
                colorOption.style.display = 'none';
            }
        }
    });

    // -----------------------------
    // On Register Activities Change
    registerActivities.addEventListener('change', e => {
        const activityCostDisplay = registerActivities.querySelector('#activities-cost');
        const selectedActivity = e.target;
        const cost = parseInt(selectedActivity.getAttribute('data-cost'));
        // If checked or unchecked update totalCost with cost
        selectedActivity.checked ? totalCost += cost : totalCost -= cost;
        activityCostDisplay.textContent = `Total: $${totalCost}`;

        // Check for conflicting time spots
        activities.forEach(activity => {
            const selectedName = selectedActivity.getAttribute('name');
            const selectedTime = selectedActivity.getAttribute('data-day-and-time');
            const activityName = activity.getAttribute('name');
            const activityTime = activity.getAttribute('data-day-and-time');
            // If checked and the selectedActivity isn't the same name as activity
            if (selectedName !== activityName && selectedActivity.checked) {
                // Disable activity if it's in the same time slot
                if (selectedTime === activityTime) {
                    activity.parentNode.className = 'disabled';
                    activity.disabled = true;
                } 
            // If unchecked
            } else if (!selectedActivity.checked) {
                // Enable activity that was in the same time slot
                if (selectedTime === activityTime) {
                    activity.parentNode.className = '';
                    activity.disabled = false;
                } 
            }
        });
    });

    // -----------------
    // On Payment Change
    payment.addEventListener('change', e => {
        const selectedPayMethod = e.target.value;
        updatePaymentMethod();
    });

    // --------------
    // On Form Submit
    form.addEventListener('submit', e => {
        e.preventDefault();
        submitForm();
    });

    initializeForm();
}

// -----------------
// Initial Page Load
document.addEventListener("DOMContentLoaded", onPageLoad);