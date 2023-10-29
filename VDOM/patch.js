import render from "./render.js";

export default function patch(rootNode, patches) {
  if (!patches || patches.length === 0) {
    return rootNode;
  }
  // 取得对应 index 的真实 DOM
  const nodes = domIndex(rootNode);
  console.log(nodes);
  console.log(patches);
  patches.forEach((patch, index) => {
    patch && applyPatch(nodes[index], patch);
  });
  return rootNode;
}

function applyPatch(node, patchList) {
  if (Array.isArray(patchList)) {
    for (let patch of patchList) {
      patchOp(node, patch);
    }
  } else {
    patchOp(node, patchList);
  }
}

function patchOp(node, patch) {
  const { type, vNode } = patch;
  const parentNode = node.parentNode;
  let newNode = null;
  switch (type) {
    case 'INSERT':
      newNode = render(vNode);
      node.appendChild(newNode);
      break;
    case 'REMOVE':
      parentNode && parentNode.removeChild(node);
      break;
    case 'REPLACE':
      newNode = render(vNode);
      parentNode && parentNode.replaceChild(newNode, node);
      break;
    case 'ORDER':
      reorderChildren(node, patch);
      break;
    case 'VTEXT':
      newNode = document.createTextNode(vNode.text);
      vNode.dom = newNode;
      parentNode.replaceChild(newNode, node);
      break;
    case 'PROPS':
      const { patches } = patch;
      patchProps(node, patches);
      break;
    default:
      break;
  }
}

function reorderChildren(rootNode, patch) {
  const { moves } = patch;
  const { removes, inserts } = moves;
  const childNodes = rootNode.children;
  const keyMap = {};
  let node;
  for (let remove of removes) {
    node = childNodes[remove.from];
    keyMap[remove.key] = node;
    rootNode.removeChild(node);
  }

  let length = childNodes.length;

  for (let insert of inserts) {
    node = keyMap[insert.key];
    rootNode.insertBefore(
      node,
      insert.to >= length++ ? null : childNodes[insert.to]
    );
  }
}

function patchProps(node, patches) {
  patches.forEach(patch => {
    const { type, key, value } = patch;
    switch (type) {
      case 'SET_PROP':
        node.setAttribute(key, value);
        break;
      case 'REMOVE_PROP':
        node.removeAttribute(key);
        break;
      default:
        break;
    }
  })
}

function domIndex(rootNode) {
  const nodes = [rootNode];
  const children = rootNode.childNodes;
  if (children.length) {
    for (let child of children) {
      if (child.nodeType === 1) {
        nodes.push(...domIndex(child));
      } else if (child.nodeType === 3) {
        nodes.push(child);
      }
    }
  }
  return nodes;
}