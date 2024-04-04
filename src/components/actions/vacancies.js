export function createItem(array, counter) {
    return array.map((el, index) => ({
        number: index + counter,
        flag: false,
        id: el,
        text: '',
        skills: null,
        error: false,
        load: false,
    }));
}
