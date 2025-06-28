# Проверка на спам

Напишите функцию `checkSpam(str)`, которая возвращает `true`, если параметр `str` содержит `'1xBet'` или `'XXX'`, в противном случае `false`.

Функция должна быть нечувствительна к регистру:

```js
checkSpam('1XbeT now') === true
checkSpam('free xxxxx') === true
checkSpam('innocent rabbit') === false
```
