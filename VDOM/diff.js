const m = new Map();

export default function diff(oldNode, newNode) {
  const patches = [];
  walk(oldNode, newNode, patches, 0);
  return patches;
}

function walk(oldNode, newNode, patches, index) {
  if (newNode === oldNode) {
    return;
  }
  let patch = patches[index];
  // console.log(index, oldNode, newNode);
  if (!oldNode) {
    // 旧节点不存在，直接插入
    patch = appendPatch(patch, {
      type: 'INSERT',
      vNode: newNode,
    });
  } else if (!newNode) {
    // 新节点不存在，删除旧节点
    patch = appendPatch(patch, {
      type: 'REMOVE',
      vNode: null,
    });
  } else if (newNode.type === 'VNode') {
    if (oldNode.type === 'VNode') {
      if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
        // 相同类型节点的 diff
        const propsPatch = diffProps(newNode.props, oldNode.props);
        if (propsPatch && propsPatch.length > 0) {
          patch = appendPatch(patch, {
            type: 'PROPS',
            patches: propsPatch,
          });
        }
        patch = diffChildren(oldNode, newNode, patches, patch, index);
      }
      else {
        // 新节点替换旧节点
        patch = appendPatch(patch, {
          type: 'REPLACE',
          vNode: newNode,
        });
      }
    }
    else {
      // 新节点替换旧节点
      patch = appendPatch(patch, {
        type: 'REPLACE',
        vNode: newNode,
      });
    }
  } else if (newNode.type === 'VText') {
    if (oldNode.type !== 'VText' || newNode.text !== oldNode.text) {
      patch = appendPatch(patch, {
        type: 'VTEXT',
        vNode: newNode,
      });
    }
  }

  if (patch) {
    patches[index] = patch;
  }
}

function diffProps(newProps, oldProps) {
  const patches = [];
  const props = Object.assign({}, newProps, oldProps);

  Object.keys(props).forEach(key => {
    const newVal = newProps[key];
    const oldVal = oldProps[key];
    if (!newVal) {
      patches.push({
        type: 'REMOVE_PROP',
        key,
        value: oldVal,
      });
    }

    if (oldVal === undefined || newVal !== oldVal) {
      patches.push({
        type: 'SET_PROP',
        key,
        value: newVal,
      });
    }
  });

  return patches;
}

function diffChildren(oldNode, newNode, patches, patch, index) {
  const oldChildren = oldNode.children;
  // 新节点重新排序
  const sortedSet = sortChildren(oldChildren, newNode.children);
  const newChildren = sortedSet.children;
  const oldLen = oldChildren.length;
  const newLen = newChildren.length;
  const len = oldLen > newLen ? oldLen : newLen;
  for (let i = 0; i < len; i++) {
    let leftNode = oldChildren[i];
    let rightNode = newChildren[i];
    index++;
    // console.log(index, oldNode);
    if (!leftNode) {
      if (rightNode) {
        // 新节点进行插入操作
        patch = appendPatch(patch, {
          type: 'INSERT',
          vNode: rightNode,
        });
      }
    } else {
      // 相同节点进行比对
      walk(leftNode, rightNode, patches, index);
    }
    if (leftNode && leftNode.type === 'VNode' && Array.isArray(leftNode.children)) {
      // console.log(leftNode.children);
      index += flattenArray(leftNode.children);
    }
  }

  if (sortedSet.moves) {
    // 最后进行重新排序
    patch = appendPatch(patch, {
      type: 'ORDER',
      moves: sortedSet.moves,
    });
  }

  return patch;
}

function flattenArray(arr) {//扁平化
  if (m.has(arr)) return m.get(arr);
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    const { children, ...rest } = arr[i];
    result.push(rest);
    if (children && children.length > 0) {
      result = result.concat(flattenArray(children));
    }
  }
  m.set(arr, result.length);
  return result.length;
}

function sortChildren(oldChildren, newChildren) {
  // 找出变化后的子节点中带 key 的 vdom (keys)，和不带 key 的 vdom (free)
  const newChildIndex = keyIndex(newChildren);
  const newKeys = newChildIndex.keys;

  // 找出变化前的子节点中带 key 的 vdom (keys)，和不带 key 的 vdom (free)
  const oldChildIndex = keyIndex(oldChildren);
  const oldKeys = oldChildIndex.keys;

  const shuffle = [];

  let deletedItems = 0;

  // 遍历变化前的子节点，对比变化后子节点的 key 值
  // 并按照对应顺序将变化后子节点的索引放入 shuffle 数组中
  for (let i = 0; i < oldChildren.length; i++) {
    const oldItem = oldChildren[i];
    let itemIndex;
    if (newKeys.hasOwnProperty(oldItem.key)) {
      itemIndex = newKeys[oldItem.key];
      shuffle.push(newChildren[itemIndex]);
    } else {
      deletedItems++;
      shuffle.push(null);
    }
  }

  // 遍历变化后的子节点，将所有之前不存在的 key 对应的子节点放入 shuffle 数组中
  for (let j = 0; j < newChildren.length; j++) {
    const newItem = newChildren[j];
    if (!oldKeys.hasOwnProperty(newItem.key)) {
      shuffle.push(newItem);
    }
  }

  const simulate = shuffle.slice();
  const removes = [];
  const inserts = [];
  let simulateIndex = 0;
  let simulateItem;
  let wantedItem;

  for (let k = 0; k < newChildren.length;) {
    wantedItem = newChildren[k]; // 期待元素: 表示变化后 k 的子节点
    simulateItem = simulate[simulateIndex]; // 模拟元素: 表示变化前 k 位置的子节点

    // 删除在变化后不存在的子节点
    while (simulateItem === null && simulate.length) {
      removes.push(remove(simulate, simulateIndex, null))
      simulateItem = simulate[simulateIndex]
    }

    if (!simulateItem || simulateItem.key !== wantedItem.key) {
      // 如果一个带 key 的子元素没有在合适的位置，则进行移动
      if (simulateItem) {
        if (newKeys[simulateItem.key] !== k + 1) {
          removes.push(remove(simulate, simulateIndex, simulateItem.key));
          simulateItem = simulate[simulateIndex];
          //如果移除操作没有把期待元素放回正确的位置，就需要插入它
          if (!simulateItem || simulateItem.key !== wantedItem.key) {
            inserts.push({ key: wantedItem.key, to: k });
          }
          //元素匹配，跳过
          else {
            simulateIndex++;
          }
        } else {
          inserts.push({ key: wantedItem.key, to: k });
        }
      } else {
        inserts.push({ key: wantedItem.key, to: k });
      }
      k++;
    } else {
      // 如果期待元素和模拟元素 key 值相等，跳到下一个子节点比对
      simulateIndex++;
      k++;
    }
  }

  // 移除所有的模拟元素
  while (simulateIndex < simulate.length) {
    simulateItem = simulate[simulateIndex];
    removes.push(
      remove(simulate, simulateIndex, simulateItem && simulateItem.key)
    );
  }

  // 如果只有删除选项中有值
  // 将操作直接交个 delete patch
  if (removes.length === deletedItems && !inserts.length) {
    return {
      children: shuffle,
      moves: null,
    };
  }

  return {
    children: shuffle,
    moves: {
      removes: removes,
      inserts: inserts,
    },
  };
}

function remove(arr, index, key) {
  arr.splice(index, 1); // 移除数组中指定元素
  return {
    from: index,
    key: key,
  };
}

function keyIndex(children) {
  const keys = {};
  const length = children.length;

  for (let i = 0; i < length; i++) {
    const child = children[i];
    keys[child.key] = i;
  }

  return {
    keys: keys, // 子节点中所有存在的 key 对应的索引
  };
}

function appendPatch(patch, apply) {
  if (patch) {
    if (Array.isArray(patch)) {
      patch.push(apply);
    } else {
      patch = [patch, apply];
    }

    return patch;
  } else {
    return apply;
  }
}