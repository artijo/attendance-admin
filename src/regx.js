export function validateThaiCharacters(input) {
  const regex = /^[ก-๙0-9\s]+$/;
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

export function validateNumber(input) {
  const regex = /^[0-9]$/;
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
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(input);
}

export function validateDepartmentName(input) {
  const regex = /^[ก-๙a-zA-Z0-9\s\-()]+$/;
  return regex.test(input);
}

export function validateClassroomNumber(input) {
  const regex = /^[0-9]{1,3}$/;
  return regex.test(input);
}

export function validateClassroomTypeThai(input) {
  const regex = /^[ก-๙0-9\s\-()]+$/;
  return regex.test(input);
}

export function validateClassroomTypeEnglish(input) {
  const regex = /^[a-zA-Z0-9\s\-()]+$/;
  return regex.test(input);
}

export function validateSubjectCode(input) {
  const regex = /^[ก-๙a-zA-Z0-9]+$/;
  return regex.test(input);
}

export function validateSubjectNameThai(input) {
  const regex = /^[ก-๙0-9\s]+$/;
  return regex.test(input);
}

export function validateSubjectNameEnglish(input) {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(input);
}

export function validateCredit(input) {
  const num = parseFloat(input);
  return !isNaN(num) && num >= 0 && num <= 10 && num % 0.5 === 0;
}
