// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract SetMatrixZeroes {
    /// @dev
    /// #1 this rewrites the vertical 0s, but it skips the first column.
    ///    this is because the first column data is still needed for the
    ///    horizontal 0s to be placed first.
    function doubleLoop(
        uint256[][] memory matrix
    ) public pure returns (uint256[][] memory) {
        uint256 rowSize = matrix.length;
        uint256 colSize = matrix[0].length;
        bool firstRowIsZeros = false;
        bool firstColIsZeros = false;

        for (uint256 r = 0; r < rowSize; r++) {
            for (uint256 c = 0; c < colSize; c++) {
                if (matrix[r][c] == 0) {
                    if (r == 0) {
                        firstRowIsZeros = true;
                    }
                    if (c == 0) {
                        firstColIsZeros = true;
                    }
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }

        if (rowSize > 1 && colSize > 1) {
            for (uint256 r = 1; r < rowSize; r++) {
                for (uint256 c = 1; c < colSize; c++) {
                    if (matrix[r][0] == 0 || matrix[0][c] == 0) {
                        matrix[r][c] = 0;
                    }
                }
            }
        }

        if (firstColIsZeros) {
            for (uint256 r = 0; r < rowSize; r++) {
                matrix[r][0] = 0;
            }
        }

        if (firstRowIsZeros) {
            for (uint256 c = 0; c < colSize; c++) {
                matrix[0][c] = 0;
            }
        }

        return matrix;
    }
}
