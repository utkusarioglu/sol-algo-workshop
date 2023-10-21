// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

library Array {
    function append(
        uint256[] memory arr,
        uint256 value
    ) public pure returns (uint256[] memory) {
        uint256[] memory newArr = new uint256[](arr.length + 1);
        for (uint256 i = 0; i < arr.length; i++) {
            newArr[i] = arr[i];
        }
        newArr[arr.length] = value;
        return newArr;
    }

    function prepend(
        uint256[] memory arr,
        uint256 value
    ) public pure returns (uint256[] memory) {
        uint256[] memory newArr = new uint256[](arr.length + 1);
        for (uint256 i = 0; i < arr.length; i++) {
            newArr[i + 1] = arr[i];
        }
        newArr[0] = value;
        return newArr;
    }

    function pop(
        uint256[] memory arr
    ) public pure returns (uint256[] memory, uint256) {
        uint256[] memory newArr = new uint256[](arr.length - 1);
        uint256 popped = arr[arr.length - 1];
        for (uint256 i = 0; i < arr.length - 1; i++) {
            newArr[i] = arr[i];
        }
        return (newArr, popped);
    }

    function shift(
        uint256[] memory arr
    ) public pure returns (uint256[] memory, uint256) {
        uint256[] memory newArr = new uint256[](arr.length - 1);
        uint256 shifted = arr[0];
        for (uint256 i = 0; i < arr.length - 1; i++) {
            newArr[i] = arr[i + 1];
        }
        return (newArr, shifted);
    }

    function isEmpty(uint256[] memory arr) public pure returns (bool) {
        return arr.length == 0;
    }

    function includes(
        uint256[] memory arr,
        uint256 value
    ) public pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return true;
            }
        }
        return false;
    }

    function fill(
        uint256[] memory arr,
        uint256 value
    ) public pure returns (uint256[] memory) {
        for (uint256 i = 0; i < arr.length; i++) {
            arr[i] = value;
        }
        return arr;
    }

    function fill(
        uint256[] memory arr,
        uint256 value,
        uint256 startIndex
    ) public pure returns (uint256[] memory) {
        for (uint256 i = startIndex; i < arr.length; i++) {
            arr[i] = value;
        }
        return arr;
    }

    function fill(
        uint256[] memory arr,
        uint256 value,
        uint256 startIndex,
        uint256 endIndex
    ) public pure returns (uint256[] memory) {
        for (uint256 i = startIndex; i < endIndex; i++) {
            arr[i] = value;
        }
        return arr;
    }

    function last(uint256[] memory arr) public pure returns (uint256) {
        return arr[arr.length - 1];
    }

    function last(
        uint256[][] memory arr
    ) public pure returns (uint256[] memory) {
        return arr[arr.length - 1];
    }
}

library GraphHelper {
    function getRowLength(Graph memory graph) public pure returns (uint256) {
        if (graph.vector.length % graph.colLength == 0) {
            return graph.vector.length / graph.colLength;
        }
        return graph.vector.length / graph.colLength + 1;
    }

    function getValue(
        Graph memory graph,
        uint256 row,
        uint256 col
    ) public pure returns (uint256) {
        return graph.vector[row * graph.colLength + col];
    }
}

struct Graph {
    uint256[] vector;
    uint256 colLength;
}

contract Dijkstra {
    using Array for uint256[];
    using Array for uint256[][];
    using GraphHelper for Graph;

    function shortestPath2(
        uint256[] memory vector,
        uint256 colLength
    ) public pure returns (uint256) {
        Graph memory graph = Graph(vector, colLength);
        uint256 rowLength = graph.getRowLength();
        uint256[] memory distances = new uint256[](rowLength);
        distances = distances.fill(2 ** 255, 1);
        uint256[] memory queue = new uint256[](1);

        while (!queue.isEmpty()) {
            uint256 row;
            (queue, row) = queue.shift();
            for (uint256 col = 0; col < colLength; col++) {
                uint256 weight = graph.getValue(row, col);
                if (weight == 0) {
                    continue;
                }
                uint256 newDistance = distances[row] + weight;
                if (newDistance < distances[col]) {
                    distances[col] = newDistance;
                }
                if (!queue.includes(col)) {
                    queue = queue.append(col);
                }
            }
        }

        return distances.last();
    }

    function shortestPathNodes(
        uint256[] memory vector,
        uint256 colLength
    ) public pure returns (uint256[] memory) {
        Graph memory graph = Graph(vector, colLength);
        uint256 rowLength = graph.getRowLength();
        uint256[] memory distances = new uint256[](rowLength);
        distances = distances.fill(2 ** 255, 1);
        uint256[][] memory paths = new uint256[][](rowLength);
        uint256[] memory queue = new uint256[](1);
        uint256[] memory visited = new uint256[](0);

        while (!queue.isEmpty()) {
            uint256 row;
            (queue, row) = queue.shift();
            visited = visited.append(row);

            for (uint256 col = 0; col < colLength; col++) {
                uint256 weight = graph.getValue(row, col);
                if (weight == 0) {
                    continue;
                }
                uint256 currentDistance = distances[row] + weight;
                if (currentDistance < distances[col]) {
                    distances[col] = currentDistance;
                    paths[col] = paths[row].append(col);
                }
                if (!queue.includes(col)) {
                    queue = queue.append(col);
                }
            }
        }

        return paths.last().prepend(0);
    }
}
