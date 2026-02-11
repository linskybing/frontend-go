import { User } from './user';
import { Project } from './project';

export enum FormStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export interface FormMessage {
  id: string;
  form_id: number;
  user_id: number;
  content: string;
  CreatedAt: string;
}

export interface Form {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  user_id: number;
  project_id?: number;
  title: string;
  description: string;
  tag: string;
  status: FormStatus;
  user?: User;
  project?: Project;
  messages?: FormMessage[];
}

export interface CreateFormRequest {
  project_id?: number;
  title: string;
  description: string;
  tag: string;
}

export interface UpdateFormStatusRequest {
  status: FormStatus;
}

export interface CreateFormMessageRequest {
  content: string;
}
