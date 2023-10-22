// 定义链表节点类
class ListNode {
  constructor(value) {
    this.val = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // 在链表尾部插入节点
  append(value) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let currentNode = this.head;
      while (currentNode.next) {
        currentNode = currentNode.next;
      }
      currentNode.next = newNode;
    }
  }

  // 在指定位置插入节点
  insert(position, value) {
    const newNode = new ListNode(value);
    if (position === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let prevNode = this.get(position, 1);
      if (prevNode) {
        newNode.next = prevNode.next;
        prevNode.next = newNode;
      }
    }
  }

  // 在指定位置删除节点
  removeAt(position) {
    if (position === 0) {
      const deletedNode = this.head;
      if (deletedNode) {
        this.head = deletedNode.next;
        deletedNode.next = null;
        return deletedNode.value;
      }
    } else {
      let prevNode = this.get(position, 1);
      if (prevNode && prevNode.next) {
        const deletedNode = prevNode.next;
        prevNode.next = deletedNode.next;
        deletedNode.next = null;
        return deletedNode.value;
      }
    }
    return undefined;
  }

  // 修改指定位置的值
  modify(position, value) {
    let currentNode = this.get(position, 0);
    // console.log(currentNode);
    if (currentNode) {
      currentNode.val = value;
      return true;
    }
    return false;
  }

  // 查找指定位置的值
  getValue(position) {
    let currentNode = this.get(position, 0);
    return currentNode ? currentNode.val : undefined;
  }

  get(position, flag) {
    let Node = this.head;
    let count = 0;
    while (Node && count < position - flag) {
      Node = Node.next;
      count++;
    }
    return Node;
  }

   // 将链表转换为数组
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

const list = new LinkedList();

list.append(1);
list.append(2);
list.append(3);
list.modify(0,5);
console.log(list.getValue(0));

console.log(list.toArray());