import { emailField, nicknameField, passwordField } from "../../constants/auth";

export const registrationFieldsErrors: Record<string, string> = {
  [nicknameField]: "Длина поля должна содержать от 4 до 42 символов",
  [emailField]: "Некорректная электронная почта",
  [passwordField]: "Длина поля должна содержать от 8 до 42 символов",
};

export const registrationErrors = {
  userExists: "Пользователь с таким Email уже существует",
} as const;

export const loginErrors = {
  userNotFound: "Пользователь не зарегистрирован",
  wrongCredentials: "Неверные пароль или Email",
};

export const coreErrors = {
  notFields: "Проверьте правильность отправки данных",
  notFound: "Не найдено",
};
