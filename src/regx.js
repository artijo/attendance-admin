export function validateThaiCharacters(input) {
    const regex = /^[ก-๙\s]+$/;
    return regex.test(input);
}

export function validateEmail(input) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input);
}

export function validatePassword(input) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(input);
}

export function validateUsername(input) {
    const regex = /^[a-zA-Z0-9]{4,}$/;
    return regex.test(input);
}

export function validateStudent(input) {
    const regex = /^[0-9]{5}$/;
    return regex.test(input);
}

export function validatePhoneNumber(input) {
    const regex = /^[0-9]{10}$/;
    return regex.test(input);
}

export function validateEnglishCharacters(input) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(input);
}