export function parseDate(value: any): Date | null {
    if (!value) return null;

    if (typeof value?.toDate === "function") {
        return value.toDate(); // Firebase Timestamp
    }

    if (value instanceof Date) {
        return value;
    }

    return new Date(value);
}