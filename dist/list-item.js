export class ListItem {
    data;
    id;
    page;
    element = null;
    constructor(data, id, page, element = null) {
        this.data = data;
        this.id = id;
        this.page = page;
        this.element = element;
    }
    isDisplayed() {
        return this.element !== null;
    }
    update(data, id) {
        this.data = data;
        if (id !== undefined) {
            this.id = id;
        }
    }
}
//# sourceMappingURL=list-item.js.map