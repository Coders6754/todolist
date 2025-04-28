export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
  }
  
  export interface MongoTodoItem extends TodoItem {
    _id?: string;
  }