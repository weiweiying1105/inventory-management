export function pickValidFields<T extends object>(obj: T): Partial<T> {
    const result: Partial<T> = {};
    Object.keys(obj).forEach(key => {
        const value = (obj as any)[key];
        if (value !== undefined && value !== null && value !== "") {
            result[key as keyof T] = value;
        }
    });
    return result;
}