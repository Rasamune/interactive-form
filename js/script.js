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
    const activitiesBox = registerActivities.querySelector('#activities-box');
    const activities = registerActivities.querySelectorAll('[type="checkbox"]');
    const payment = document.querySelector('#payment');
    const form = document.querySelector('form');
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    let totalCost = 0;
    // Credit Card Fields
    const ccInput = document.querySelector('#cc-num');
    const ccZip = document.querySelector('#zip');
    const ccCCV = document.querySelector('#cvv');
    const ccExpMonth = document.querySelector('#exp-month');
    const ccExpYear = document.querySelector('#exp-year');

    // --------------------------
    // Set initial element values
    function initializeForm() {
        // Reset Option Selections on Page Refresh
        tshirtDesign.selectedIndex = 0;
        tshirtColor.selectedIndex = 0;
        jobRole.selectedIndex = 0;
        payment.selectedIndex = 1; // Credit Card is default
        ccExpMonth.selectedIndex = 0;
        ccExpYear.selectedIndex = 0;

        // Reset Fields to Blank
        nameInput.value = '';
        emailInput.value = '';
        ccInput.value = '';
        ccZip.value = '';
        ccCCV.value = '';

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
        //Update Tooltip
        checkSubmit(tshirtDesign.selectedIndex, tshirtDesign, e);
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
        // Check if an activity has been selected and update tooltip
        checkSubmit(isActivityChecked(), activitiesBox, e);
        const activityCostDisplay = registerActivities.querySelector('#activities-cost');
        const selectedActivity = e.target;
        const cost = parseInt(selectedActivity.getAttribute('data-cost'));
        // Check for conflicting time spots
        activities.forEach(activity => {
            const selectedName = selectedActivity.getAttribute('name');
            const selectedTime = selectedActivity.getAttribute('data-day-and-time');
            const activityName = activity.getAttribute('name');
            const activityTime = activity.getAttribute('data-day-and-time');
            // If checked and the selectedActivity isn't the same name as activity
            if (selectedName !== activityName && selectedActivity.checked && selectedTime === activityTime) {
                // Disable activity if it's in the same time slot
                activity.parentNode.className = 'disabled';
                activity.disabled = true;
            // If unchecked
            } else if (!selectedActivity.checked && selectedTime === activityTime) {
                // Enable activity that was in the same time slot
                activity.parentNode.className = '';
                activity.disabled = false;
            }
        });
        // If checked or unchecked update totalCost with cost
        selectedActivity.checked ? totalCost += cost : totalCost -= cost;
        activityCostDisplay.textContent = `Total: $${totalCost}`;
    });

    // -----------------
    // On Payment Change
    payment.addEventListener('change', e => {
        updatePaymentMethod();
    });

    // ----------------------------
    // Update CC Tooltips on Change
    ccExpMonth.addEventListener('change', e => {
        checkSubmit(ccExpMonth.selectedIndex, ccExpMonth, e);
    });
    ccExpYear.addEventListener('change', e => {
        checkSubmit(ccExpYear.selectedIndex, ccExpYear, e);
    });

    // --------------------------
    // Tooltip for missing fields
    function showOrHideToolTip(show, element) {
        if (show) {
            element.previousElementSibling.classList.add('not-valid');
            element.style.display = 'inherit';
        } else {
            element.previousElementSibling.classList.remove('not-valid');
            element.style.display = 'none';
        }
    }

    // --------------------------
    // Validate field when typing
    function checkInput(validator) {
        return e => {
            const text = e.target.value;
            const valid = validator(text);
            const showTip = text !== '' && !valid;
            const tooltip = e.target.nextElementSibling;
            showOrHideToolTip(showTip, tooltip);
        };
    }

    // -------------------
    // Validate Name Field
    function checkNameInput(validator) {
        return e => {
            const text = e.target.value;
            const valid = validator(text);
            const showTip = text !== '' && !valid;
            const tooltip = e.target.nextElementSibling;
            if (!valid) {
                // Check if name contains Numbers, Special Characters or Both
                const containsNum = containsNumbers(text);
                const containsSpec = containsSpecial(text);
                if (containsNum && containsSpec) {
                    tooltip.innerHTML = `Name field cannot be blank, cannot contain numbers or any special characters<i class="fas fa-exclamation-circle"></i>`;
                } else if (containsNum) {
                    tooltip.innerHTML = `Name field cannot contain numbers<i class="fas fa-exclamation-circle"></i>`;
                } else if (containsSpec) {
                    tooltip.innerHTML = `Name field cannot contain special characters<i class="fas fa-exclamation-circle"></i>`;
                }
            }

            showOrHideToolTip(showTip, tooltip);
        };
    }

    // -------------------------------
    // Check if Field can be submitted
    function checkSubmit (validate, element, e) {
        if (validate){
            // Submit Form
            element.classList.remove('not-valid');
            const tooltip = element.nextElementSibling;
            showOrHideToolTip(false, tooltip);
        } else {
            // Prevent form submission and show tooltip
            e.preventDefault();
            //const text = element.value;
            element.classList.add('not-valid');
            const tooltip = element.nextElementSibling;
            showOrHideToolTip(true, tooltip);
        }
    }

    // --------------------------------------
    // Check if an Activity Has been selected
    function isActivityChecked () {
        let activityChecked = false;
        activities.forEach(activity => {
            if (activity.checked) {
                activityChecked = true;
            }
        });
        return activityChecked;
    }

    // ----------------------------
    // Check Valid Regex for Fields
    const isValidName = name => /^[^\d\W_][a-zA-Z\s-]*$/.test(name);
    const containsNumbers = text => /\d+/.test(text);
    const containsSpecial = text => /[^a-zA-Z0-9\s]+/.test(text);
    const isValidEmail = email => /[^\s\W]?[a-zA-Z-_\d]+@[a-zA-Z\d]+\.\w{3}$/.test(email);
    const isValidCC = cc => /^\d{13}\d?\d?\d?$/.test(cc);
    const isValidZip = zip => /^\d{5}$/.test(zip);
    const isValidCCV = ccv => /^\d{3}$/.test(ccv);

    // -------------------------------
    // Fields to validate while typing
    nameInput.addEventListener('input', checkNameInput(isValidName));
    emailInput.addEventListener('input', checkInput(isValidEmail));
    ccInput.addEventListener('input', checkInput(isValidCC));
    ccZip.addEventListener('input', checkInput(isValidZip));
    ccCCV.addEventListener('input', checkInput(isValidCCV));

    // --------------
    // On Form Submit
    form.addEventListener('submit', e => {
        checkSubmit(isValidName(nameInput.value), nameInput, e);
        checkSubmit(isValidEmail(emailInput.value), emailInput, e);
        checkSubmit(tshirtDesign.selectedIndex, tshirtDesign, e);
        // If credit card payment is selected
        if (payment.selectedIndex === 1) {
            checkSubmit(isValidCC(ccInput.value), ccInput, e);
            checkSubmit(isValidZip(ccZip.value), ccZip, e);
            checkSubmit(isValidCCV(ccCCV.value), ccCCV, e);
            checkSubmit(ccExpMonth.selectedIndex, ccExpMonth, e);
            checkSubmit(ccExpYear.selectedIndex, ccExpYear, e);
        }
        checkSubmit(isActivityChecked(), activitiesBox, e);

        // Scroll to first invalid field
        const errorElements = document.querySelectorAll('.not-valid');
        if (errorElements) {
            errorElements[0].parentElement.scrollIntoView(true);
        }
    });

    
    initializeForm();
}

// -----------------
// Initial Page Load
document.addEventListener("DOMContentLoaded", onPageLoad);