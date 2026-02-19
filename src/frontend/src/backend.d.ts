import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    checked: boolean;
    text: string;
}
export interface backendInterface {
    addTask(text: string): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    removeTask(text: string): Promise<void>;
    toggleTask(text: string): Promise<void>;
}
