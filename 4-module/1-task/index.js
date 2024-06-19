function makeFriendList(friends) {
  let list = document.createElement('ul');
  const getListItem = ({firstName, lastName}) => {
    return `
            <li>
               <span>${firstName}</span>
               <span>${lastName}</span>
            </li>
            `;
  };

  list.innerHTML = friends.map(({firstName, lastName}) => `
  ${getListItem({firstName, lastName})}`).join('');
  return list;
}

module.exports = makeFriendList;

