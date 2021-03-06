function validateForm() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dateFromInput = document.getElementById('dateFrom');
    const dateToInput = document.getElementById('dateTo');
    const visitorsInput = document.getElementById('visitors');
    const numberRoomInput = document.getElementById('numberRoom');

    const errorFirstName = document.getElementById('errorFirstName');
    const errorLastName = document.getElementById('errorLastName');
    const errorEmail = document.getElementById('errorEmail');
    const errorPhone = document.getElementById('errorPhone');
    const errorDateFrom = document.getElementById('errorDateFrom');
    const errorDateTo = document.getElementById('errorDateTo');
    const errorVisitors = document.getElementById('errorVisitors');
    const errorNumberRoom = document.getElementById('errorNumberRoom');

    const errorsSummary = document.getElementById('errorsSummary');

    let nowDate = new Date(),
    month = '' + (nowDate.getMonth() + 1),
    day = '' + nowDate.getDate(),
    year = nowDate.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    const nowString = [year, month, day].join('-');
    resetErrors([firstNameInput, lastNameInput, emailInput, phoneInput, dateFromInput, dateToInput, visitorsInput, numberRoomInput], [errorFirstName, errorLastName, errorEmail, errorPhone, errorDateFrom, errorDateTo, errorVisitors, errorNumberRoom], errorsSummary);
    
    let valid = true;

    if (!checkRequired(firstNameInput.value)) {
        valid = false;
        firstNameInput.classList.add("error-input");
        errorFirstName.innerText = "Pole jest wymagane";
    } else if (!checkTextLengthRange(firstNameInput.value, 2, 60)) {
        valid = false;
        firstNameInput.classList.add("error-input");
        errorFirstName.innerText = "Pole powinno zawiera?? od 2 do 60 znak??w";
    }

    if (!checkRequired(lastNameInput.value)) {
        valid = false;
        lastNameInput.classList.add("error-input");
        errorLastName.innerText = "Pole jest wymagane";
    } else if (!checkTextLengthRange(lastNameInput.value, 2, 60)) {
        valid = false;
        lastNameInput.classList.add("error-input");
        errorLastName.innerText = "Pole powinno zawiera?? od 2 do 60 znak??w";
    }

    if (!checkRequired(emailInput.value)) {
        valid = false;
        emailInput.classList.add("error-input");
        errorEmail.innerText = "Pole jest wymagane";
    } else if (!checkTextLengthRange(emailInput.value, 5, 60)) {
        valid = false;
        emailInput.classList.add("error-input");
        errorEmail.innerText = "Pole powinno zawiera?? od 5 do 60 znak??w";
    } else if (!checkEmail(emailInput.value)) {
        valid = false;
        emailInput.classList.add("error-input");
        errorEmail.innerText = "Pole powinno zawiera?? prawid??owy adres email";
    }

    if (!checkRequired(phoneInput.value)) {
        valid = false;
        phoneInput.classList.add("error-input");
        errorPhone.innerText = "Pole jest wymagane";
    } else if (!checkTextLengthRange(phoneInput.value, 9, 9)) {
        valid = false;
        phoneInput.classList.add("error-input");
        errorPhone.innerText = "Pole powinno zawiera?? prawid??owy numemer telefonu np. 111111111";
    }

    if (!checkRequired(dateFromInput.value)) {
        valid = false;
        dateFromInput.classList.add("error-input");
        errorDateFrom.innerText = "Pole jest wymagane";
    } else if (!checkDate(dateFromInput.value)) {
        valid = false;
        dateFromInput.classList.add("error-input");
        errorDateFrom.innerText = "Pole powinno zawiera?? dat?? w formacie yyyy-MM-dd (np. 20.01.2001)";
    } else if (checkDateIfBefore(dateFromInput.value, nowString)) {
        valid = false;
        dateFromInput.classList.add("error-input");
        errorDateFrom.innerText = "Data nie mo??e by?? z przesz??o??ci";
    }

    if (!checkRequired(dateToInput.value)) {
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Pole jest wymagane";
    } else if (!checkDate(dateToInput.value)) {
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Pole powinno zawiera?? dat?? w formacie yyyy-MM-dd (np. 20.01.2001)";
    } else if (checkDateIfBefore(dateToInput.value, nowString)) {
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Data nie mo??e by?? z przesz??o??ci";
    } else if (checkRequired(dateToInput.value) && checkDate(dateToInput.value)
        && !checkDateIfBefore(dateFromInput.value, dateToInput.value)) {
        //je??li data od oraz data do jest poprawna, sprawdzamy kolejno???? dat
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Data ko??ca rezerwacji powinna by?? p????niejsza ni?? data pocz??tku rezerwacji";
    } 
    

    if (!checkRequired(visitorsInput.value)) {
        valid = false;
        visitorsInput.classList.add("error-input");
        errorVisitors.innerText = "Pole jest wymagane";
    } else if (!checkValue(visitorsInput.value, 1, 5)) {
        valid = false;
        visitorsInput.classList.add("error-input");
        errorVisitors.innerText = "Liczba go???? powinna si?? mie??ci?? w przedziale 1 - 5";
    }

   if (!checkRequired(numberRoomInput.value)) {
        valid = false;
        numberRoomInput.classList.add("error-input");
        errorNumberRoom.innerText = "Pole jest wymagane";
    }

    if (!valid) {
        errorsSummary.innerText = "Formularz zawiera b????dy";
    }

    return valid;
}