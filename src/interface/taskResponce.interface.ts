import { Task } from "src/schemas/task.schema";

export interface TaskResponse {
  status: string;
  statusCode: number;
  task: Task;
}