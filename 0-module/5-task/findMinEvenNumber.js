function findMinEvenNumber(nums) {
  let isFoundAtIndex = -1;

  for (let j = 0; j < nums.length; j++) {
    if (nums[j] % 2 === 0) {
      if (isFoundAtIndex === -1 || nums[j] < isFoundAtIndex ) {
        isFoundAtIndex = nums[j];
      }
    }
  }
  return isFoundAtIndex;
}


module.exports = findMinEvenNumber;
