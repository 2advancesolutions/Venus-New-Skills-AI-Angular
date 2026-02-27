import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.scss']
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  activeTodos: Todo[] = [];
  completedTodos: Todo[] = [];
  newTodoTitle = '';

  constructor(
    private todoService: TodoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.todos$ = this.todoService.todos$;
    this.todos$.subscribe(todos => {
      this.activeTodos = todos.filter(todo => !todo.completed);
      this.completedTodos = todos.filter(todo => todo.completed);
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle);
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
    const todo = [...this.activeTodos, ...this.completedTodos].find(t => t.id === id);
    if (todo) {
      this.toastr.success('Task complete', 'Success');
    }
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  drop(event: CdkDragDrop<Todo[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update todo status based on drop zone
      const todo = event.container.data[event.currentIndex];
      const completed = event.container.id === 'completed-list';
      this.todoService.moveTodo(todo.id, completed);
      
      if (completed) {
        this.toastr.success('Task complete', 'Success');
      }
    }
  }
}