export default function createElement(tag, properties, ...children) {
  const childNodes = [];
  const props = properties || {};
  let key = null;

  children
    .reduce((arr, val) => arr.concat(val), [])
    .forEach(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        childNodes.push({
          type: 'VText',
          text: String(child),
        })
        return;
      };
      childNodes.push(child);
    });

  key = props.key.toString();
  delete props.key;
  
  return {
    type: 'VNode',
    tag,
    key,
    props: props || {},
    children: childNodes,
  };
}