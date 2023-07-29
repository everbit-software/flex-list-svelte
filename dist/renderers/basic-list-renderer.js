import { AbstractRenderer } from "./abstract-renderer";
export class BasicListRenderer extends AbstractRenderer {
    // List renderer
    renderItem;
    list;
    isOrdered = false;
    constructor(config) {
        super(config);
        this.renderItem = config.renderItem;
        this.isOrdered = config.isOrdered ?? false;
    }
    setup() {
        // (Un)ordered list
        this.list = document.createElement(this.isOrdered ? 'ol' : 'ul');
        // Add table to the container
        this.containerElement.innerHTML = '';
        this.containerElement.append(this.list);
    }
    createItemElement(item) {
        const li = document.createElement('li');
        li.innerHTML = this.renderItem(item);
        return li;
    }
    addItemToContainer(item) {
        this.list.append(item.element);
    }
    clearItems() {
        this.list.innerHTML = '';
    }
    setupSpinner() {
    }
    getSpinnerElement() {
        let li = document.createElement('li');
        li.innerHTML = this.loaderHtml;
        return li;
    }
    toggleSpinner(show) {
        if (show) {
            this.list.innerHTML = '';
            this.list.append(this.getSpinnerElement());
        }
    }
    showItemSpinner(item) {
        if (!item.element) {
            return;
        }
        item.element.innerHTML = '';
        item.element.append(this.getSpinnerElement());
    }
    displayMessage(message, errorOccured) {
        let li = document.createElement('li');
        li.innerHTML = message;
    }
}
//# sourceMappingURL=basic-list-renderer.js.map