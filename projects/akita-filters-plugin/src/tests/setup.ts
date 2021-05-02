import {ActiveState, EntityState, EntityStore, ID, QueryEntity, StoreConfig} from "@datorama/akita";

const getInitialActiveState = () =>
  ({
    active: null
  } as ActiveState);

export class Todo {
  id: ID;
  title?: string;
  completed?: false;
  price?: number;
  constructor(params: Todo) {
    Object.assign(this, params);
    if (!params.title) {
      this.title = params.id.toString();
    }
  }
}

export interface TodoState extends EntityState<Todo>, ActiveState {
  metadata?: { name: string };
}

export const initialTodoState: TodoState = {
  ...getInitialActiveState(),
  metadata: { name: 'metadata' }
};

@StoreConfig({
  name: 'todos'
})
export class TodosStore extends EntityStore<TodoState, Widget> {
  constructor() {
    super(initialTodoState);
  }
}

export interface TodoCustomID {
  todoId: ID;
  title?: string;
  completed?;
}

export interface StateTwoState extends EntityState<TodoCustomID> {}

export const initialCustomIDState: StateTwoState = {
};

@StoreConfig({
  name: 'todos',
  idKey: 'todoId'
})
export class TodosStoreCustomID extends EntityStore<StateTwoState, TodoCustomID> {
  constructor() {
    super(initialCustomIDState, { idKey: 'todoId' });
  }
}

export function createTodos(len) {
  const arr = [];
  const factory = ct();
  for (let i = 0; i < len; i++) {
    arr.push(factory());
  }
  return arr;
}

export function ct() {
  let count = 0;
  return function() {
    const id = count++;
    return {
      id,
      title: `Todo ${id}`,
      complete: false
    };
  };
}

export function cot() {
  return {
    id: 1,
    title: `Todo ${1}`,
    complete: false
  } as Todo;
}

export interface Widget {
  id: ID;
  title: string;
  complete?: boolean;
}

export interface WidgetState extends EntityState<Todo>, ActiveState {
  metadata?: { name: string };
}

@StoreConfig({ name: 'widgets' })
export class WidgetsStore extends EntityStore<WidgetState> {
  constructor(initState?) {
    super(initState);
  }
}

export class WidgetsQuery extends QueryEntity<WidgetState> {
  constructor(protected store) {
    super(store);
  }
}

export function createWidget(id): Widget {
  return {
    id,
    title: `Widget ${id}`,
    complete: false
  } as Widget;
}

export function createWidgetCompleted(id): Widget {
  return {
    id,
    title: `Widget ${id}`,
    complete: true
  } as Widget;
}
