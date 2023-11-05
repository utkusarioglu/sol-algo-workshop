// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract MaxDepthOfBinaryTree {
    function getLeftChildIndex(uint256 index) private pure returns (uint256) {
        return index * 2 + 1;
    }

    function getRightChildIndex(uint256 index) private pure returns (uint256) {
        return index * 2 + 2;
    }

    function findDepth(
        uint256[] memory tree,
        uint256 index
    ) private pure returns (uint256) {
        if (index >= tree.length) {
            return 0;
        }
        if (tree[index] == 0) {
            return 0;
        }
        uint256 maxDepth = 1;
        uint256 left = findDepth(tree, getLeftChildIndex(index));
        uint256 right = findDepth(tree, getRightChildIndex(index));

        maxDepth += left > right ? left : right;

        return maxDepth;
    }

    function findDepth(uint256[] memory tree) public pure returns (uint256) {
        return findDepth(tree, 0);
    }
}
