function truncate(str, maxlength) {
  let resStr = '';
  if (str.length <= maxlength) {
    resStr = str;
  }
  else {
    resStr = `${str.substring(0, maxlength - 1)}…`;
  }
  return resStr;
}
