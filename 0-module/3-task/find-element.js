function findElementInSequence(x, nums) {

  let isFoundAtIndex = -1;
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] === x ) {
      isFoundAtIndex = j;
    }
  }
  return isFoundAtIndex;
}

export default findElementInSequence;
