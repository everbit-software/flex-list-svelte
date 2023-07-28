export class ListItem {
    public data: object;
    public id: string|number;
    public page: number;
    public element: HTMLElement|null = null;

    constructor(data: object, id: string|number, page: number, element: HTMLElement|null = null) {
        this.data = data;
        this.id = id;
        this.page = page;
        this.element = element;
    }

    public isDisplayed() {
        return this.element !== null;
    }

    public update(data: object, id?: string|number) {
        this.data = data;

        if (id !== undefined) {
            this.id = id;
        }
    }
}