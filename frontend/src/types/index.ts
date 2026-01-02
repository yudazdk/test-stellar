export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  assignments?: any[];
  comments?: any[];
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export type TRegisterRequest = Omit<User, 'id'> & { password: string };

export type TTaskFormData = Pick<Task, 'title' | 'description' | 'status' | 'priority'>;

export type TRegisterResponse = LoginResponse;

export type Nullable<T> = T | null;

export type ApiResponse = any;

