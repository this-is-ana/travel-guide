function validateEmail(email: string) {
    return email.match(/^(\w+[\-\.])*\w+@(\w+\.)+[A-Za-z]+$/);
}

function validateUsername(username: string) {
    return username.length >= 4 && username.length <= 15
}

function validatePassword(password1: string, password2: string) {
    return password1.length >= 6 && password2.length >= 6 && password1 == password2
}

function handleErrorMsg(row: any, message: string) {
    row.firstElementChild.innerHTML = message
    row.classList.remove("ion-hide")
}

export { validateEmail, validateUsername, validatePassword, handleErrorMsg }