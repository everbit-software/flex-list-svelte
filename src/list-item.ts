export class ListItem {
    public data: object;
    public id: string|number;

    constructor(data: object, id: string|number) {
        this.data = data;
        this.id = id;
    }

    public update(data: object, id?: string|number) {
        this.data = data;

        if (id !== undefined) {
            this.id = id;
        }
    }
}