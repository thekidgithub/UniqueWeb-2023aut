class Node {
    constructor(key, value) {
        this.val = [key, value];
        this.next = null;
        this.prev = null;
    }
}

class LRU {
    constructor(cache) {
        this.head = null;
        this.cache = cache;
        this.size = 0;
        this.map = new Map();
    }

    addFirst(newNode) {
        if (!this.head) {
            this.head = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
    }

    removeLast() {
        if (!this.head) {
            return;
        }
        let currentNode = this.head;
        while (currentNode.next) {
            currentNode = currentNode.next;
        }

        if (currentNode === this.head) {
            this.head = null;
        } else {

            currentNode.prev.next = null;
        }
        return currentNode;
    }
    remove(Node) {
        if (!this.head) {
            return;
        }
        let currentNode = this.head;

        while (currentNode) {

            if (currentNode.val === Node.val) {

                if (currentNode === this.head) {
                    this.head = currentNode.next;
                    if (this.head) {
                        this.head.prev = null;
                    }
                } else {

                    currentNode.prev.next = currentNode.next;
                    if (currentNode.next) {
                        currentNode.next.prev = currentNode.prev;
                    }
                }
                break;
            }
            currentNode = currentNode.next;
        }
    }

    getNode(val) {
        let Node = this.head;
        while (Node && Node.val !== val) {
            Node = Node.next;
        }
        return Node;
    }

    put(key, val) {
        const newNode = new Node(key, val);
        if (this.map.has(key)) {
            this.remove(this.map.get(key));

            this.addFirst(newNode);

            this.map.set(key, newNode);
        }
        else if (this.size === this.cache) {
            const deletedNode = this.removeLast();
            this.map.delete(deletedNode.val[0]);
            this.addFirst(newNode);
            this.map.set(key, newNode);
        }
        else {
            this.addFirst(newNode);
            this.map.set(key, newNode);
            this.size++;
        }
    }

    get(key) {
        if (!this.map.has(key)) return null;
        const val = this.map.get(key).val[1];
        this.put(key, val);
        return val;
    }

    toArray() {
        const arr = [];
        let currentNode = this.head;
        while (currentNode) {
            arr.push(currentNode.val);
            currentNode = currentNode.next;
        }
        return arr;
    }
}

const lru = new LRU(2);

lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1));
lru.put(3, 3);
// console.log(lru.toArray());
console.log(lru.get(2));
lru.put(4, 4);
console.log(lru.get(1));
console.log(lru.get(3));
console.log(lru.get(4));
