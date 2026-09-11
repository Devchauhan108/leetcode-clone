
import java.util.*;

class Main {

    public static void main(String[] args) {

        Solution solution = new Solution();

        int[] nums = {3, 2, 4};
        int target = 6;

        int[] result = solution.twoSum(nums, target);

        System.out.println(Arrays.toString(result));
    }
}
