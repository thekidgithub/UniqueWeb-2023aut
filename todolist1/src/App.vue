<script setup>
import { computed, ref, watchEffect } from 'vue';
const filter = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.done),
  completed: (todos) => todos.filter((todo) => todo.done)
}
const TIME = /^(?:[1-9]|1\d|2[0-3]):[0-5]\d/;
const todos = ref(JSON.parse(localStorage.getItem('key')) || []);
const status = ref('all');
const editedTodo = ref(null);
const draggedItem = ref(null);
const lastEnteredItem = ref(null);
const todoList = ref();

const filterTodos = computed(() => {
  return sortByTime(filter[status.value](todos.value));
});
const remaining = computed(() => {
  return filter.active(todos.value).length;
});

watchEffect(() => {
  localStorage.setItem('key', JSON.stringify(todos.value));
});

function add(e) {
  const value = e.target.value.trim();
  if (!value) return;
  todos.value.push({
    value,
    done: 0,
    id: new Date(),
    time: TIME.test(value) ? TIME.exec(value)[0] : '24:00'
  });
  e.target.value = '';
}

function remove(todo) {
  todos.value.splice(todos.value.indexOf(todo), 1);
}

function clearCompleted() {
  todos.value = filter.active(todos.value);
}

function toggleAll() {
  if (remaining.value) {
    todos.value.forEach(e => {
      e.done = 1;
    });
  }
  else {
    todos.value.forEach(e => {
      e.done = 0;
    });
  }
}
function editTodo(todo) {
  editedTodo.value = todo;
}
function doneEdit(todo) {
  if (!todo.value) {
    remove(todo);
    return;
  }
  editedTodo.value = null;
}

function sortByTime(arr) {
  arr.sort(function (a, b) {
    const [h1, m1] = a.time.split(':').map(str => parseInt(str, 10));
    const [h2, m2] = b.time.split(':').map(str => parseInt(str, 10));
    if (h1 === h2) return m1 - m2;
    else return h1 - h2;
  })
  return (arr)
}

function dragStart(e) {
  draggedItem.value = e.target;
}

function dragEnter(e) {
  lastEnteredItem.value = e.target;
}

function dragEnd() {
  if (lastEnteredItem.value) {
    const draggedIndex = Array.from(todoList.value.childNodes).indexOf(draggedItem.value);
    const enteredIndex = Array.from(todoList.value.childNodes).indexOf(lastEnteredItem.value);
    const [draggedTodo] = todos.value.splice(draggedIndex - 1, 1);
    console.log(draggedTodo);
    todos.value.splice(enteredIndex - 1, 0, draggedTodo);
    lastEnteredItem.value = null;
    draggedItem.value = null;
  }
}
</script>

<template>
  <h1>todos</h1>
  <div class="container">
    <div class="up">
      <div :class="['seleteall', 'iconfont', { show: !remaining }]" v-show="todos.length" @click="toggleAll">&#xe664;
      </div>
      <input type="text" class="input" placeholder="What needs to be done?" @keyup.enter="add" autofocus>
    </div>
    <ul class="todolist" v-show="todos.length" ref="todoList">
      <li v-for="todo in filterTodos" :class="['todo', { checked: todo.done }]" :key="todo.id" draggable="true"
        @dragstart="dragStart" @dragenter.prevent="dragEnter" @dragend="dragEnd" @dragover.prevent="">
        <div class="check iconfont" @click="todo.done = !todo.done">&#xe7fc;</div>
        <div class="text" @dblclick="editTodo(todo)">{{ todo.value }}</div>
        <div class="close iconfont" @click="remove(todo)">&#xe74d;</div>
        <input type="text" class="inputabove" v-if="editedTodo === todo" v-model="todo.value"
          @keyup.enter="doneEdit(todo)" @vue:mounted="({ el }) => el.focus()">
      </li>
    </ul>
    <div class="bottom" v-show="todos.length">
      <div class="left">{{ remaining }} items left</div>
      <div class="changemode">
        <div :class="['mode', { seleted: status === 'all' }]" @click="status = 'all'">all</div>
        <div :class="['mode', { seleted: status === 'active' }]" @click="status = 'active'">active</div>
        <div :class="['mode', { seleted: status === 'completed' }]" @click="status = 'completed'">completed</div>
      </div>
      <div class="clear" v-show="filter.completed(todos).length" @click="clearCompleted">clear completed</div>
    </div>
  </div>
</template>

<style>
@import url(./style.css);
@import url(./font_gvlw8z0jjg/iconfont.css);
@import url(./font_gvlw8z0jjg/demo.css);
</style>