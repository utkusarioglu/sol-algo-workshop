// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract BubbleSort {
    function sort(
        uint16[] memory unsorted
    ) public pure returns (uint16[] memory) {
        assembly {
            let mptr_return_start := 0x40
            let val_param_ofst := 0x4
            let return_size := sub(calldatasize(), val_param_ofst)
            calldatacopy(mptr_return_start, 0x4, return_size)

            let pptr_arr_len := add(
                val_param_ofst,
                calldataload(val_param_ofst)
            )
            let val_arr_len := mload(0x60)
            let ptr_arr_first_elem := 0x80

            for {
                let has_change := 0x1
            } eq(has_change, 0x1) {

            } {
                if eq(has_change, 0x0) {
                    break
                }
                has_change := 0x0

                for {
                    let i_large := 0x1
                } lt(i_large, val_arr_len) {
                    i_large := add(0x1, i_large)
                } {
                    let i_small := sub(i_large, 0x1)
                    let ptr_small := add(ptr_arr_first_elem, mul(0x20, i_small))
                    let ptr_large := add(ptr_arr_first_elem, mul(0x20, i_large))
                    let val_small := mload(ptr_small)
                    let val_large := mload(ptr_large)
                    if gt(val_small, val_large) {
                        mstore(ptr_small, val_large)
                        mstore(ptr_large, val_small)
                        has_change := 0x1
                    }
                }
            }
            return(mptr_return_start, return_size)
        }
    }
}
