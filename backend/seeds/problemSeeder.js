const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Problem = require('../models/Problem');

const problems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    order: 1,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to target*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    tags: ['Array', 'Hash Table'],
    testCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
      { input: '3 2 4\n6', expectedOutput: '1 2', isHidden: false },
      { input: '3 3\n6', expectedOutput: '0 1', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
};`,
      python: `def twoSum(nums, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 49,
    totalSubmissions: 1000,
    acceptedSubmissions: 490,
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    order: 2,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only '()[]{}'.",
    ],
    tags: ['String', 'Stack'],
    testCases: [
      { input: '()', expectedOutput: 'true', isHidden: false },
      { input: '()[]{}\n', expectedOutput: 'true', isHidden: false },
      { input: '(]', expectedOutput: 'false', isHidden: false },
      { input: '([)]', expectedOutput: 'false', isHidden: true },
      { input: '{[]}', expectedOutput: 'true', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
};`,
      python: `def isValid(s: str) -> bool:
    # Your code here
    pass`,
      cpp: `#include <string>
using namespace std;

bool isValid(string s) {
    // Your code here
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 40,
    totalSubmissions: 800,
    acceptedSubmissions: 320,
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    order: 3,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    tags: ['Linked List', 'Recursion'],
    testCases: [
      { input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { input: '1 2', expectedOutput: '2 1', isHidden: false },
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Your code here
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverseList(head):
    # Your code here
    pass`,
      cpp: `// Definition for singly-linked list.
// struct ListNode {
//     int val;
//     ListNode *next;
//     ListNode() : val(0), next(nullptr) {}
//     ListNode(int x) : val(x), next(nullptr) {}
//     ListNode(int x, ListNode *next) : val(x), next(next) {}
// };

ListNode* reverseList(ListNode* head) {
    // Your code here
}`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 73,
    totalSubmissions: 600,
    acceptedSubmissions: 438,
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    order: 4,
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { input: 'pwwkew', expectedOutput: '3', isHidden: true },
      { input: '', expectedOutput: '0', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Your code here
};`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Your code here
    pass`,
      cpp: `#include <string>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Your code here
}`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 33,
    totalSubmissions: 900,
    acceptedSubmissions: 297,
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    order: 5,
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 10^4',
    ],
    tags: ['Array', 'Sorting'],
    testCases: [
      { input: '1 3\n2 6\n8 10\n15 18', expectedOutput: '1 6\n8 10\n15 18', isHidden: false },
      { input: '1 4\n4 5', expectedOutput: '1 5', isHidden: false },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
function merge(intervals) {
    // Your code here
};`,
      python: `def merge(intervals):
    # Your code here
    pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Your code here
}`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 46,
    totalSubmissions: 700,
    acceptedSubmissions: 322,
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    difficulty: 'Medium',
    order: 6,
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` *if* \`word\` *exists in the grid*.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true',
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
      'board and word consists of only lowercase and uppercase English letters.',
    ],
    tags: ['Array', 'Backtracking', 'Matrix'],
    testCases: [
      { input: 'ABCE\nSFCS\nADEE\nABCCED', expectedOutput: 'true', isHidden: false },
      { input: 'ABCE\nSFCS\nADEE\nSEE', expectedOutput: 'true', isHidden: false },
      { input: 'ABCE\nSFCS\nADEE\nABCB', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
function exist(board, word) {
    // Your code here
};`,
      python: `def exist(board, word: str) -> bool:
    # Your code here
    pass`,
      cpp: `#include <vector>
#include <string>
using namespace std;

bool exist(vector<vector<char>>& board, string word) {
    // Your code here
}`,
      java: `class Solution {
    public boolean exist(char[][] board, String word) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 39,
    totalSubmissions: 500,
    acceptedSubmissions: 195,
  },
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    order: 7,
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6',
    ],
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    testCases: [
      { input: '1 3\n2', expectedOutput: '2.00000', isHidden: false },
      { input: '1 2\n3 4', expectedOutput: '2.50000', isHidden: false },
      { input: '0 0\n0 0', expectedOutput: '0.00000', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
    // Your code here
};`,
      python: `def findMedianSortedArrays(nums1, nums2) -> float:
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // Your code here
}`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 36,
    totalSubmissions: 400,
    acceptedSubmissions: 144,
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    order: 8,
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    testCases: [
      { input: '0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { input: '4 2 0 3 2 5', expectedOutput: '9', isHidden: false },
      { input: '3 0 2 0 4', expectedOutput: '7', isHidden: true },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
    // Your code here
};`,
      python: `def trap(height) -> int:
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

int trap(vector<int>& height) {
    // Your code here
}`,
      java: `class Solution {
    public int trap(int[] height) {
        // Your code here
    }
}`,
    },
    acceptanceRate: 57,
    totalSubmissions: 350,
    acceptedSubmissions: 200,
  },
];

const seedProblems = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI not set in .env');
      process.exit(1);
    }

    const mongoose = require('mongoose');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    await Problem.insertMany(problems);
    console.log(`Seeded ${problems.length} problems`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedProblems();
