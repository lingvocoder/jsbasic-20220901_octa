/**
 * Данная функция остаётся без изменений
 */
function print(text) {
  console.log(text);
}

/**
 * Данную функцию необходимо изменить так,
 * чтобы функция sayHello работала корректно
 */
function isValid(name) {
  let isValid = true;

  if (!name) {
    isValid = false;
  }
  else if (name.indexOf(' ') !== -1) {
    isValid = false;
  }
  else if (name.length < 4) {
    isValid = false;
  }
  return isValid;
}

function sayHello() {
  let userName = prompt('Введите ваше имя');

  if (isValid(userName)) {
    print(`Welcome back, ${userName}!`);
  } else {
    print('Некорректное имя пользователя');
  }
}

export default isValid;
