# Трансформировать массив объектов в массив имён

У вас есть массив объектов `user`, и в каждом из них есть свойство `user.name`.
Задача – написать функцию `namify`, которая преобразует исходный массив в массив имён.

*Например:*

```js
let vasya = { name: 'Вася', age: 25 };
let petya = { name: 'Петя', age: 30 };
let masha = { name: 'Маша', age: 28 };

let users = [ vasya, petya, masha ];

function namify(users) {
  // ваш код
}

let names = namify(users); // ['Вася', 'Петя', 'Маша']
```
