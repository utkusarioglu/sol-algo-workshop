// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

struct Set {
    uint256[] members;
}

library SetMethods {
    /// Inserts the given value to the set
    /// @param self the set to which to insert the value
    /// @param value value to insert to the set
    function insert(
        Set memory self,
        uint256 value
    ) public pure returns (Set memory) {
        if (index(self.members, value) != -1) {
            return self;
        }

        uint256 length = self.members.length;
        uint256[] memory n = new uint256[](length + 1);
        for (uint256 i = 0; i < length; i++) {
            n[i] = self.members[i];
        }
        n[length] = value;

        return Set(n);
    }

    /// Removes the given value from the set.
    /// @param self the set from which to remove.
    /// @param value the value to remove from the given set.
    function remove(
        Set memory self,
        uint256 value
    ) public pure returns (Set memory) {
        int256 selfIndex = index(self.members, value);
        if (selfIndex == -1) {
            return self;
        }
        uint256 length = self.members.length;
        uint256[] memory updated = new uint256[](length - 1);
        for (uint256 i = 0; i < length - 1; i++) {
            if (i < uint256(selfIndex)) {
                updated[i] = self.members[i];
            } else if (i > uint256(selfIndex)) {
                updated[i] = self.members[i + 1];
            }
        }
        return Set(updated);
    }

    /// Can you tell me something that makes you happy and can't be bought?
    /// @param self array to look in
    /// @param value value to search for
    function index(
        uint256[] memory self,
        uint256 value
    ) private pure returns (int256) {
        for (uint256 i = 0; i < self.length; i++) {
            if (value == self[i]) {
                return int256(i);
            }
        }
        return -1;
    }
}

struct Node {
    uint256 value;
    Set edges;
}

library QueueMethods {
    function push(
        uint256[] memory self,
        uint256 value
    ) public pure returns (uint256[] memory) {
        uint256[] memory pushed = new uint256[](self.length + 1);
        for (uint256 i = 0; i < self.length; i++) {
            pushed[i] = self[i];
        }
        pushed[self.length] = value;
        return pushed;
    }

    function peek(uint256[] memory self) public pure returns (uint256) {
        return self[0];
    }

    function pop(uint256[] memory self) public pure returns (uint256[] memory) {
        uint256[] memory popped = new uint256[](self.length - 1);
        for (uint256 i = 0; i < self.length - 1; i++) {
            popped[i] = self[i + 1];
        }
        return popped;
    }
}

error EdgeAbsent();

contract Bfs {
    using SetMethods for Set;
    using QueueMethods for uint256[];

    function search(
        Node[] memory rawNodes,
        uint256 startIndex
    ) public pure returns (uint256[] memory) {
        uint256 length = rawNodes.length;
        Node[] memory nodes = new Node[](length);
        for (uint256 n = 0; n < rawNodes.length; n++) {
            Set memory edges = Set(new uint256[](0));
            for (uint256 e = 0; e < rawNodes[n].edges.members.length; e++) {
                uint256 edge = rawNodes[n].edges.members[e];
                if (edge >= length) {
                    revert EdgeAbsent();
                }
                edges = edges.insert(edge);
            }
            nodes[n] = Node(rawNodes[n].value, edges);
        }
        uint256[] memory res;
        uint256[] memory queue;
        queue = queue.push(startIndex);

        while (queue.length > 0) {
            Node memory current = nodes[queue.peek()];
            queue = queue.pop();
            res = res.push(current.value);
            for (
                uint256 edgeIndex = 0;
                edgeIndex < current.edges.members.length;
                edgeIndex++
            ) {
                queue = queue.push(current.edges.members[edgeIndex]);
            }
        }

        return res;
    }
}
