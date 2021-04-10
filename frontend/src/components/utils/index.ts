export const getItemFromStorage = (key: string): any | undefined => {

    const item = localStorage.getItem(key)

    try {
        if (item) {
            return JSON.parse(item)
        }
        else return undefined
    } catch (error) {
        return undefined
    }
}

export const setItemToStorage = (key: string, newItem: any): boolean => {
    try {
        localStorage.setItem(key, JSON.stringify(newItem))
        return true
    } catch (error) {
        return false
    }
}

export const removeItemFromStorage = (label: string): void => {
    localStorage.removeItem(label)
}

// According to Django auth User model
// https://docs.djangoproject.com/en/3.1/ref/contrib/auth/#django.contrib.auth.models.User.username
// "150 characters or fewer. Usernames may contain alphanumeric, _, @, +, . and - characters."
export const validateUsername = (username: string): boolean => {
    const re = /^(\w|[@_*+-]){1,150}$/
    return re.test(username)
}


interface Id {
    id: string | number
}

export function removeFromArray<T extends Id>(arr: T[], id: T['id']) {
    return arr.filter((item) => id !== item.id)
}
export function replaceFromArray<T extends Id>(arr: T[], item: T) {
    const i = arr.findIndex((old) => old.id === item.id)
    if (i >= 0) {
        arr[i] = item
        return [...arr]
    }
    throw Error('Item doesn\'t exist in in the Array.')
}
export function updateItemInArray<T extends Id>(arr: T[], id: T['id'], updater: (arg: T) => T) {
    const i = arr.findIndex((item) => item.id === id)
    if (i >= 0) {
        arr[i] = updater(arr[i])
        return [...arr]
    }
    throw Error('Item doesn\'t exist in in the Array.')
}
