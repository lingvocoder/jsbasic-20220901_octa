## Кондиционер

В офисе, где работает программист Петр, установили кондиционер нового типа. 
Этот кондиционер отличается особой простотой в управлении. 
У кондиционера есть всего лишь два управляемых параметра: желаемая температура и режим работы.

Кондиционер может работать в следующих четырех режимах:
- **«freeze»** — охлаждение. В этом режиме кондиционер может только уменьшать температуру.
Если температура в комнате и так не больше желаемой, то он выключается.
- **«heat»** — нагрев. В этом режиме кондиционер может только увеличивать температуру.
Если температура в комнате и так не меньше желаемой, то он выключается.
- **«auto»** — автоматический режим. В этом режиме кондиционер может как увеличивать, 
так и уменьшать температуру в комнате до желаемой.
- **«fan»** — вентиляция. В этом режиме кондиционер осуществляет только вентиляцию воздуха
и не изменяет температуру в комнате.

Кондиционер достаточно мощный, поэтому при настройке на правильный режим работы он за
час доводит температуру в комнате до желаемой. Требуется написать программу, которая определяет температуру в комнате через час с учётом
заданных параметров:
- температура в комнате **_troom_**
- установленная на кондиционере желаемая температура **_tcond_**
- режим работы


### Формат ввода

Первый параметр — целое число **_troom_**.

Второй параметр — целое число **_tcond_**.

Третий параметр — строка из одного слова, записанного строчными буквами латинского алфавита — режим работы кондиционера.
***
__Допустимый диапазон температур__
_**–50 ≤ troom ≤ 50, –50 ≤ tcond ≤ 50**_
***

### Формат вывода

Вывести одно целое число — температуру, которая установится в комнате через час.

### Примеры

| Ввод           | Вывод |
|----------------|:-----:|
| 10, 20, heat   |  20   |
| 10, 20, freeze |  10   |

***
__Примечания__

В первом примере кондиционер находится в режиме нагрева. 
Через час он нагреет комнату до желаемой температуры в **20** градусов.

Во втором примере кондиционер находится в режиме охлаждения. 
Поскольку температура в комнате ниже, чем желаемая, кондиционер 
самостоятельно выключается и температура в комнате не поменяется.
