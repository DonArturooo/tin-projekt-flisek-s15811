function validateForm() {
    

    const dateFromInput = document.getElementById('dateFrom');
    const dateToInput = document.getElementById('dateTo');
    const visitorsInput = document.getElementById('visitors');
    const numberRoomInput = document.getElementById('numberRoom');
    const clientInput = document.getElementById('visitor');

    const errorDateFrom = document.getElementById('errorDateFrom');
    const errorDateTo = document.getElementById('errorDateTo');
    const errorVisitors = document.getElementById('errorVisitors');
    const errorNumberRoom = document.getElementById('errorNumberRoom');
    const errorClient = document.getElementById('errorVisitor');

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

    let valid = true;
    
    dateFromInput.classList.remove("error-input")
    dateToInput.classList.remove("error-input")
    visitorsInput.classList.remove("error-input")
    numberRoomInput.classList.remove("error-input")
    clientInput.classList.remove("error-input")

    resetErrors([dateFromInput, dateToInput, visitorsInput, numberRoomInput, clientInput], [errorDateFrom, errorDateTo, errorNumberRoom, errorVisitors, errorClient], errorsSummary)
    

    if (!checkRequired(dateFromInput.value)) {
        valid = false;
        dateFromInput.classList.add("error-input");
        errorDateFrom.innerText = "Pole jest wymagane";
    } else if (!checkDate(dateFromInput.value)) {
        valid = false;
        dateFromInput.classList.add("error-input");
        errorDateFrom.innerText = "Pole powinno zawierać datę w formacie yyyy-MM-dd (np. 20.01.2001)";
    } else if (checkDateIfBefore(dateFromInput.value, nowString)) {
        valid = false;
        dateFromInput.classList.add("error-input");
        errorDateFrom.innerText = "Data nie może być z przeszłości";
    }

    if (!checkRequired(dateToInput.value)) {
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Pole jest wymagane";
    } else if (!checkDate(dateToInput.value)) {
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Pole powinno zawierać datę w formacie yyyy-MM-dd (np. 20.01.2001)";
    } else if (checkDateIfBefore(dateToInput.value, nowString)) {
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Data nie może być z przeszłości";
    } else if (checkRequired(dateToInput.value) && checkDate(dateToInput.value)
        && !checkDateIfBefore(dateFromInput.value, dateToInput.value)) {
        //jeśli data od oraz data do jest poprawna, sprawdzamy kolejność dat
        valid = false;
        dateToInput.classList.add("error-input");
        errorDateTo.innerText = "Data końca rezerwacji powinna być późniejsza niż data początku rezerwacji";
    } 
    

    if (!checkRequired(visitorsInput.value)) {
        valid = false;
        visitorsInput.classList.add("error-input");
        errorVisitors.innerText = "Pole jest wymagane";
    } else if (!checkValue(visitorsInput.value, 1, 5)) {
        valid = false;
        visitorsInput.classList.add("error-input");
        errorVisitors.innerText = "Liczba gość powinna się mieścić w przedziale 1 - 5";
    }

   if (!checkRequired(numberRoomInput.value)) {
        valid = false;
        numberRoomInput.classList.add("error-input");
        errorNumberRoom.innerText = "Pole jest wymagane";
    }

    if (!checkRequired(clientInput.value)) {
        valid = false;
        clientInput.classList.add("error-input");
        errorClient.innerText = "Pole jest wymagane";
    }

    if (!valid) {
        errorsSummary.innerText = "Formularz zawiera błędy";
    }

    return valid;
}