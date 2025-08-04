function findElementInSequence(X, nums) {

  let isFoundAtIndex = -1;
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] === X ) {
      isFoundAtIndex = j;
    }
  }
  return isFoundAtIndex;
}

export default findElementInSequence;
