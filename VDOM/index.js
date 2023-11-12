import createElement from "./init.js";
import render from "./render.js";
import diff from "./diff.js";
import patch from "./patch.js";
import updateNode from "./diff2.js";

const con = document.querySelector('.container');

const vdom1 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('span', { id: 'b', 'key': 'b' },
        ['b']),
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'e', 'key': 'e' },
            ['e']),
          createElement('span', { id: 'f', 'key': 'f' },
            ['f'])
        ]),
      createElement('span', { id: 'g', 'key': 'g' },
        ['g'])
    ]);

const vdom2 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('span', { id: 'b', 'key': 'b' },
        ['b']),
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'e', 'key': 'e' },
            ['e']),
          createElement('span', { id: 'f', 'key': 'f' },
            ['f']),
          createElement('span', { id: 'h', 'key': 'h' },
            ['h']),
        ]),
      createElement('span', { id: 'g', 'key': 'g' },
        ['g']),
      createElement('span', { id: 'i', 'key': 'i' },
        ['i']),
    ]);//INSERT

const vdom3 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'f', 'key': 'f' },
            ['f'])
        ]),
      createElement('span', { id: 'g', 'key': 'g' },
        ['g'])
    ]);//REMOVE

const vdom4 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('span', { id: 's', 'key': 'b' },
        ['b']),
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'e', 'key': 'e' },
            ['']),
          createElement('span', { 'key': 'f' },
            ['f'])
        ]),
      createElement('span', { id: 'g', class: 'a', 'key': 'g' },
        ['gg'])
    ]);//TEXT AND PROPS

const vdom5 =
  createElement('div', { id: 's', 'key': 's' },
    [
      createElement('span', { id: 'b', 'key': 'b' },
        ['b']),
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'e', 'key': 'e' },
            ['e']),
          createElement('span', { id: 'f', 'key': 'f' },
            ['f'])
        ]),
      createElement('span', { id: 'g', 'key': 'g' },
        ['g'])
    ]);//REPLACE ROOT

const vdom6 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('span', { id: 'g', 'key': 'g' },
        ['g']),
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'f', 'key': 'f' },
            ['f']),
          createElement('span', { id: 'e', 'key': 'e' },
            ['e'])
        ]),
      createElement('span', { id: 'h', 'key': 'h' },
        ['h']),
      createElement('span', { id: 'b', 'key': 'b' },
        ['b']),
    ]);//REORDER

const vdom7 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('span', { id: 'b', 'key': 'b' },
        [
          createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'e', 'key': 'e' },
            ['e']),
          createElement('span', { id: 'f', 'key': 'f' },
            ['f'])
        ]),
      createElement('div', { id: 'c', 'key': 'c' },
        ['b']),
      createElement('span', { id: 'g', 'key': 'g' },
        ['g'])
    ]);//TEXT <==> NODE
const vdom8 =
  createElement('div', { id: 'a', 'key': 'a' },
    [
      createElement('span', { id: 'b', 'key': 'b' },
        ['b']),
      createElement('div', { id: 'c', 'key': 'c' },
        [
          createElement('span', { id: 'ee', 'key': 'ee' },
            ['ee']),
            createElement('span', { id: 'd', 'key': 'd' },
            ['d']),
          createElement('span', { id: 'f', 'key': 'f' },
            ['f']),
            createElement('span', { id: 'ff', 'key': 'ff' },
            ['ff']),
        ]),
      createElement('span', { id: 'g', 'key': 'g' },
        ['g'])
    ]);
    
const mode = 1;
const targetDOM = vdom8;
if (mode === 1) {
  const patches = diff(vdom1, targetDOM);
  const target = render(vdom1);
  if (patches.length === 1 && patches[0].type === 'REPLACE') {
    const subTarget = render(targetDOM);
    con.appendChild(subTarget);
  }
  else if (!targetDOM) {
    con.appendChild(render(vdom1));
  }
  else {
    con.appendChild(patch(target, patches));
  }
}

if (mode === 2) {
  con.appendChild(render(vdom1));
  updateNode(vdom1, targetDOM, con);
}