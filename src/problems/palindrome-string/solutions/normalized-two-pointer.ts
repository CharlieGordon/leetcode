export function isPalindrome(s: string): boolean {
    const normalizedStr = s.toLowerCase().replace(/[^a-z0-9]/g, "")

    let start = 0
    let end = normalizedStr.length - 1

    while(start <= end) {
        if(normalizedStr[start] !== normalizedStr[end]) {
            return false
        }

        start++
        end--
    }

    return true
};
