function validateForm() {
    const numberRoomInput = document.getElementById('numberRoom');
    const numberOfSpaceInput = document.getElementById('numberOfSpace');


    const errorNumberRoom = document.getElementById('errorNumberRoom');
    const errorNumberOfSpace = document.getElementById('errorNumberOfSpace');

    const errorsSummary = document.getElementById('errorsSummary');   
    
    resetErrors([numberRoomInput, numberOfSpaceInput], [errorNumberRoom, errorNumberOfSpace], errorsSummary);
    
    let valid = true;

    if (!checkRequired(numberRoomInput.value)) {
        valid = false;
        numberRoomInput.classList.add("error-input");
        errorNumberRoom.innerText = "Pole jest wymagane";
    } else if (!checkValue(numberRoomInput.value, 1, 100)) {
        valid = false;
        numberRoomInput.classList.add("error-input");
        errorNumberRoom.innerText = "Numer pokoju nie jest w dopuszczalnym przedziale min 1 maks 100";
    }

    if (!checkRequired(numberOfSpaceInput.value)) {
        valid = false;
        numberOfSpaceInput.classList.add("error-input");
        errorNumberOfSpace.innerText = "Pole jest wymagane";
    } else if (!checkValue(numberOfSpaceInput.value, 1, 5)) {
        valid = false;
        numberOfSpaceInput.classList.add("error-input");
        errorNumberOfSpace.innerText = "Liczba miejsc nie jest w dopuszczalnym przedziale min 1 maks 5";
    }

    if (!valid) {
        errorsSummary.innerText = "Formularz zawiera błędy";
    }

    return valid;
}