function truncate(str, maxlength) {
  return str.length <= maxlength ? str : `${str.substring(0, maxlength - 1)}…`;
}

module.exports = truncate;
