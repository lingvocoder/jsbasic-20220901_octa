function findElementInSequence(X, nums) {

  let isFoundAtIndex = -1;
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] === X && isFoundAtIndex === -1) {
      isFoundAtIndex = j;
    }
  }
  return isFoundAtIndex;
}

module.exports = findElementInSequence;
