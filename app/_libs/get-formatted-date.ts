export function getFormattedDate(date:String): string {
    const dateComponents = date.split(/[T-]/);
    const year = dateComponents[0];
    const month = dateComponents[1];
    const day = dateComponents[2];
    const time = dateComponents[3];
    return `${year}-${month}-${day} ${time}`;
}