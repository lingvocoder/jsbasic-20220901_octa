# Переведите текст вида border-left-width в borderLeftWidth

Напишите функцию `camelize(str)`, которая преобразует строку вида `'my-short-string'` в `'myShortString'`.

То есть, дефисы удаляются, а первые буквы слов, следующих за дефисом, становятся заглавными.

*Например:*

```js
camelize('background-color') == 'backgroundColor';
camelize('list-style-image') == 'listStyleImage';
camelize('-webkit-transition') == 'WebkitTransition';
```
***
__Подсказка:__ 

Используйте метод `split`, чтобы преобразовать строку в массив символов, затем преобразуйте саму строку и с помощью метода `join` соедините все символы.
