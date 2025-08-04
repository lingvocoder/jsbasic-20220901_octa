function findSequenceMax(nums) {
  if (nums.length === 0) return 0;
  let maxValue = nums[0];
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] > maxValue) maxValue = nums[j];
  }
  return maxValue;
}


export default findSequenceMax;
