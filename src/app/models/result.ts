export interface Result<T> {
    data: T | undefined;
    status: number;
    errors: string[] | undefined;
}