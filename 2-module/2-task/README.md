# Определите, пуст ли объект

Необходимо создать функцию isEmpty(obj), которая возвращает `true`, 
если в объекте нет свойств и `false` – если хоть одно свойство есть.

Работать должно так:
```js
function isEmpty(obj) {
  // ваш код...
}

let schedule = {};

console.log( isEmpty(schedule) ); // true

schedule["8:30"] = "подъём";

console.log( isEmpty(schedule) ); // false
```
