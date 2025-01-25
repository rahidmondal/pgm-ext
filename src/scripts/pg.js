const uppercaseCheckbox = document.getElementById("upperCase");
const lowercaseCheckbox = document.getElementById("lowerCase");
const numberCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const allCheck = document.getElementById("allCheck");
const generateButton = document.getElementById("generate");
const result = document.getElementById("result");
const customAlert = document.getElementById("customAlertModal");
const customAlertButton = document.getElementById("customAlertButton");
const customAlterMessage = document.getElementById("customAlertMessage");
const copyButton = document.getElementById("copy");





const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()';





lengthInput.addEventListener("input", function () {
    lengthValue.textContent = this.value;
});

allCheck.addEventListener("click", function () {
    if (allCheck.checked) {
        uppercaseCheckbox.checked = true;
        lowercaseCheckbox.checked = true;
        numberCheckbox.checked = true;
        symbolsCheckbox.checked = true;
    } else {
        uppercaseCheckbox.checked = false;
        lowercaseCheckbox.checked = false;
        numberCheckbox.checked = false;
        symbolsCheckbox.checked = false;
    }
});

function getRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

async function generatePassword() {

    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numberCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;
    const length = parseInt(lengthInput.value);

    let charSet = '';
    let password = '';
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        customAlert.style.display = "flex";
        customAlterMessage.innerHTML = "Please select at least one character set";
        customAlertButton.addEventListener("click", function () {
            customAlert.style.display = "none";
        });
        return;
    }
    if (includeUppercase) {
        charSet += upperCaseChars;
        password += upperCaseChars[getRandomInt(upperCaseChars.length)];
    }
    if (includeLowercase) {
        charSet += lowerCaseChars;
        password += lowerCaseChars[getRandomInt(lowerCaseChars.length)];
    }
    if (includeNumbers) {
        charSet += numberChars;
        password += numberChars[getRandomInt(numberChars.length)];
    }
    if (includeSymbols) {
        charSet += symbolChars;
        password += symbolChars[getRandomInt(symbolChars.length)];
    }

    for (let i = password.length; i < length; i++) {
        let randomChar;
        do {
            randomChar = charSet[getRandomInt(charSet.length)];
        } while (randomChar === password[i - 1]);
        password += randomChar;
    }

    password = password.split('').sort(() => getRandomInt(2) - 1).join('');

    result.innerHTML = "<p>" + password + "</p>";
}

generateButton.addEventListener("click", generatePassword);

document.getElementById('returnButton').addEventListener('click', function() {
    window.location.href = '../index.html';
});

copyButton.addEventListener('click', function () {

    var password = document.getElementById('result').innerText;

    if (password === "") {
        customAlterMessage.innerHTML = "Please generate password first";
        customAlert.style.display = "flex";
        customAlertButton.addEventListener("click", function () {
            customAlert.style.display = "none";
        });
        return;
    }
    else {

        try {
            navigator.clipboard.writeText(password);
            customAlterMessage.innerHTML = "Password copied to clipboard";
        } catch (error) {
            console.log(error);
            customAlterMessage.innerHTML = "Failed to copy password to clipboard";
        }
        customAlert.style.display = "flex";
        customAlertButton.addEventListener("click", function () {
            customAlert.style.display = "none";
        });

    }
});