console.log("app is running")


var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var app = $('#mortgageCalculator');
const clearAllBtn = $('.clearAllBtn');
const mortgageAmount = $('.mortgageAmount');
const mortgageTerm = $('.mortgageTerm');
const interestRate = $('.interestRate');
const mortgageType = $('.mortgage_type');
const calculateRepayments = $('.btn_calculateRepayments');
const mortgageAmount_error = $('.mortgageAmount_error');
const empty_message_error = 'This field is required.';
const number_message_error = 'This field is number.';

var mortgageAmountMoney = 0;
var mortgageTermYears = 0;
var interestRatePercent = 0;
var radioCheckedType = '';

/* Clear input error */
clearErrorOnClick(mortgageAmount);
clearErrorOnClick(mortgageTerm);
clearErrorOnClick(interestRate);
clearErrorRadioChecked(mortgageType);

/* Format Input Mortgage Amount - ex: 300000 -> 300,000*/
const amountInput = document.querySelector('#mortgageAmount');

amountInput.addEventListener('input', (event) => {
    let value = event.target.value;

    // 1️⃣ Xoá dấu phẩy trước khi xử lý
    value = value.replace(/,/g, '');

    // 2️⃣ Chỉ cho phép số và dấu .
    value = value.replace(/[^0-9.]/g, '');

    // 3️⃣ Chỉ cho phép 1 dấu .
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // 4️⃣ Format phần nguyên
    if (value === '') {
        event.target.value = '';
        return;
    }

    const [integerPart, decimalPart] = value.split('.');

    const formattedInteger = new Intl.NumberFormat('en-US').format(integerPart);

    event.target.value = decimalPart !== undefined
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;
});

/* Calculate and Show results */
calculateRepayments.addEventListener('click', function() {

    //Check Mortgage Amount input
    var mortgageAmount_input = mortgageAmount.querySelector('input');
    if (checkNumberString(mortgageAmount_input.value)) {
        mortgageAmountMoney = checkNumberString(mortgageAmount_input.value);
        mortgageAmount.classList.remove('error');
    } else {
        mortgageAmount_error.innerText = empty_message_error;
        mortgageAmount.classList.add('error');
    }

    //Check Mortgage Term input
    var mortgageTerm_input = mortgageTerm.querySelector('input');
    if (checkNumberString(mortgageTerm_input.value)) {
        mortgageTermYears = checkNumberString(mortgageTerm_input.value);
        mortgageTerm.classList.remove('error');
    } else {
        if (mortgageTerm_input.value =='') {
            mortgageTerm.querySelector('.term_error').innerText = empty_message_error;
        } else {
            mortgageTerm.querySelector('.term_error').innerText = number_message_error;
        }
        mortgageTerm.classList.add('error');
    }
    
    //Check Mortgage Term input
    var interestRate_input = interestRate.querySelector('input');
    if (checkNumberString(interestRate_input.value)) {
        interestRatePercent = checkNumberString(interestRate_input.value);
        interestRate.classList.remove('error');
    } else {
        if (interestRate_input.value == '') {
            interestRate.querySelector('.interest_error').innerText = empty_message_error;
        } else {
            interestRate.querySelector('.interest_error').innerText = number_message_error;
        }
        interestRate.classList.add('error');
    }

    //Check Mortgage Type checked
    const selectedRadio = mortgageType.querySelector('input[name="mortgageType"]:checked');
    if (selectedRadio) {
        radioCheckedType = selectedRadio.value;
        mortgageType.classList.remove('error');
    } else {
        mortgageType.classList.add('error');
        mortgageType.querySelector('small').innerText = empty_message_error;
    }

    // Show result
    results = (repaymentCal(mortgageAmountMoney, mortgageTermYears, interestRatePercent, radioCheckedType))

    const empty_results_start = $('.empty_results_start');
    if(empty_results_start) {
        empty_results_start.style.display = 'none';
    }

    const completed_results = $('.completed_results');
    if(completed_results) {
        completed_results.style.display = 'flex';
    }

    const monthly_repaymnet_money = $('.monthly_repaymnet_money');
    if(Number.isFinite(results.monthly)) {
        const formattedMonthly = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(results.monthly) 
        monthly_repaymnet_money.innerText = formattedMonthly;
    } else {
         monthly_repaymnet_money.innerHTML = '&nbsp;';
    }
    
    const total_repay_money = $('.total_repay_money');
    if(Number.isFinite(results.total)) {
        const formattedTotal = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(results.total)
        total_repay_money.innerText = formattedTotal;
    } else {
        total_repay_money.innerHTML = '&nbsp;';
    }
});

/* End Calculate and Show results */


// Clear All Procedure
clearAllBtn.addEventListener('click', function() {
    //Reset input
    const textInputs = $$('#mortgageCalculator input[type="text"]');
    const radios = $$('#mortgageCalculator input[type="radio"]');
    textInputs.forEach(input => input.value = '');
    radios.forEach(radio => radio.checked = false);

    /* Reset error containers */
    const errorBlocks = $$('#mortgageCalculator .mortgageAmount_error, \
                            #mortgageCalculator .term_error, \
                            #mortgageCalculator .interest_error, \
                            #mortgageCalculator .mortgage_type_error ');
    errorBlocks.forEach(errorElement => errorElement.innerText = '');

    /* Remove error states */
    const errorStates = $$('#mortgageCalculator .error');
    errorStates.forEach(errorState => errorState.classList.remove('error'));

    /* Reset JS variables */
    mortgageAmountMoney = 0;
    mortgageTermYears = 0;
    interestRatePercent = 0;
    radioChecked = '';
    
    /* Reset result view */
    const monthly_repaymnet_money = $('.monthly_repaymnet_money');
    monthly_repaymnet_money.innerHTML = '&nbsp;';
    
    const total_repay_money = $('.total_repay_money');
    total_repay_money.innerHTML = '&nbsp;';
    
});

/*------------------------------------------------------------------
                    FUNCTION CHECK INPUT VALUE
--------------------------------------------------------------------*/
var checkNumberString = function(checkString) {
    let inputNumber = Number(checkString.replace(/,/g, ''));
    if(inputNumber > 0) {
        return inputNumber;
    } else {
        return false;
    }
}

/*------------------------------------------------------------------
                    FUNCTION REMOVE ERROR WHEN USER CLICK INPUT
--------------------------------------------------------------------*/
function clearErrorOnClick(elementClick) {
    const inputElement = elementClick.querySelector('input');

    inputElement.addEventListener('focus', () => {
        elementClick.classList.remove('error');
    })
};

/*------------------------------------------------------------------
                    FUNCTION REMOVE ERROR WHEN USER CLICK RADIOS
--------------------------------------------------------------------*/
function clearErrorRadioChecked(radios) {
    const radioCheck = radios.querySelectorAll('input[type="radio"]');
    
    radioCheck.forEach(radio => {
        radio.addEventListener('change', function() {
            radios.classList.remove('error');
        })
    })
};

/*------------------------------------------------------------------
            FUNCTION CALCULATE MONTHLY REPAYMENT
--------------------------------------------------------------------*/
function repaymentCal(amountMoney, termYear, interestRate, type) {
    let P = amountMoney;
    let Y = termYear;
    let R = interestRate;
    let r = interestRate / (12 * 100);
    let n = termYear * 12;
    let monthly, total;
    if (type === 'repayment') {
        monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        total = monthly * n;
    }

    if (type === 'interest_only') {
        monthly = P * r;
        total = monthly * n;
    }

    return {
        monthly: monthly,
        total: total
    };

}

