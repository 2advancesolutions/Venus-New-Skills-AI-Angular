import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    const stored = localStorage.getItem('todos');
    if (stored) {
      this.todosSubject.next(JSON.parse(stored));
    }
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todosSubject.value));
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    const currentTodos = this.todosSubject.value;
    this.todosSubject.next([...currentTodos, newTodo]);
    this.saveTodos();
  }

  toggleTodo(id: string): void {
    const currentTodos = this.todosSubject.value;
    const updatedTodos = currentTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todosSubject.next(updatedTodos);
    this.saveTodos();
  }

  deleteTodo(id: string): void {
    const currentTodos = this.todosSubject.value;
    const updatedTodos = currentTodos.filter(todo => todo.id !== id);
    this.todosSubject.next(updatedTodos);
    this.saveTodos();
  }

  moveTodo(id: string, completed: boolean): void {
    const currentTodos = this.todosSubject.value;
    const updatedTodos = currentTodos.map(todo =>
      todo.id === id ? { ...todo, completed } : todo
    );
    this.todosSubject.next(updatedTodos);
    this.saveTodos();
  }
}