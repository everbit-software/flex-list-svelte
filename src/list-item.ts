export class ListItem {
    public data: any;
    public id: string|number;

    constructor(data: any, id: string|number) {
        this.data = data;
        this.id = id;
    }

    public update(data: any, id?: string|number) {
        this.data = data;

        if (id !== undefined) {
            this.id = id;
        }
    }
}