export function reverseString(arr: string[]): void {
    const lastIndex = arr.length - 1

    for(let i = 0; i < arr.length / 2; i++) {
        const temp = arr[i]

        arr[i] = arr[lastIndex - i]
        arr[lastIndex - i] = temp
    }
};
