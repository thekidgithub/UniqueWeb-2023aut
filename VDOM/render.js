export default function render(vdom) {
  if (vdom && vdom.type === 'VText') {
    const text = document.createTextNode(vdom.text);
    vdom.dom = text;
    return text;
  }

  const { tag, props, children } = vdom;
  const element = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    element.setAttribute(key, value);
  })

  children.map(render).forEach(element.appendChild.bind(element));

  // 将真实 DOM 挂载到虚拟 DOM 中，方便 diff 过程中进行更新 
  vdom.dom = element;
  return element;
}