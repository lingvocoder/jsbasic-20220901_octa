function camelize(str) {
  return str.split('-')
    .map((el, idx) => {
      return idx !== 0 && el !== '' ? el.charAt(0).toUpperCase().concat(el.slice(1)) : el;
    })
    .join('');
}

export default camelize;
/*Решение с помощью цикла FOR*/
// function camelize(str) {
//     let strArray = str.split('-');
//     let resStr = '';
//     for (let i = 0; i < strArray.length; i++) {
//         let currWord = strArray[i];
//         if (i !== 0) {
//             if (currWord !== '') {
//                 currWord = currWord.charAt(0).toUpperCase().concat(currWord.slice(1));
//
//             } else {
//                 strArray.splice(i, 1);
//                 currWord = currWord.charAt(0).toUpperCase();
//                 i--;
//             }
//         }
//         resStr += currWord;
//     }
//     return resStr;
// }

/*Решение с помощью SPLICE и цикла FOR*/
// function camelize(str) {
//   let arr = str.split("");
//   let res
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].includes("-")) {
//       arr.splice(i, 1);
//       i--;
//       arr[i + 1] = arr[i + 1].toUpperCase();
//       res = arr.join("");
//     }
//   }
//   return (res)
// }
