# Функция makeFriendList(friends)

Необходимо реализовать функцию `makeFriendList`, которая преобразует переданный массив объектов в стандартный HTML список, состоящий из тегов`ul` и `li`.

Массив с объектами имеет следующий формат:
```js
let friends = [
    {
        firstName: 'Artyom',
        lastName: 'Mezin'
    },
    {
        firstName: 'Ilia',
        lastName: 'Kantor'
    },
    {
        firstName: 'Christopher',
        lastName: 'Michael'
    }
];
```
Функция возвращает DOM-элемент `ul`, внутри которого будет список друзей:

```html
<ul>
   <li>Artyom Mezin</li>
   <li>Ilia Kantor</li>
   <li>Christopher Michael</li>
</ul>
```
***
__Важно!__

Функция должна вернуть именно **DOM элемент**, а не строку с вёрсткой. 
При этом добавлять элементы списка внутрь тега `ul`, вы можете используя свойство `innerHTML` или любой другой способ.



