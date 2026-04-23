export function groupAnagrams(strs: string[]): string[][] {
    const groups: Map<string, string[]> = new Map()

    for(let item of strs) {
        const key = item.split('').sort().join('')

        if(!groups.has(key)) {
            groups.set(key, [])
        }

        groups.get(key)!.push(item)
    }

    return Array.from(groups.values())
}
