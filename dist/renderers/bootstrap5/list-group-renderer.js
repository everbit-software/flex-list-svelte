import { AbstractRenderer } from "../abstract-renderer";
export class ListGroupRenderer extends AbstractRenderer {
    itemsContainer;
    renderRow;
    renderItemSpinner;
    constructor(config) {
        super(config);
        this.renderRow = config.renderRow;
        this.renderItemSpinner = config.renderItemSpinner;
    }
    setup() {
        // Items container
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.classList.add('list-group', 'list-group-lg', 'list-group-flush');
        // Add table to the container
        this.containerElement.innerHTML = '';
        this.containerElement.append(this.itemsContainer);
    }
    createItemElement(item) {
        let row = this.renderRow(item);
        if (row instanceof HTMLElement) {
            return row;
        }
        else {
            let element = document.createElement('div');
            element.innerHTML = row;
            return element.firstElementChild;
        }
    }
    addItemToContainer(item) {
        this.itemsContainer.append(item.element);
    }
    clearItems() {
        this.itemsContainer.innerHTML = '';
    }
    setupSpinner() {
    }
    toggleSpinner(show) {
        if (!show) {
            return;
        }
        this.spinnerElement = document.createElement('div');
        this.spinnerElement.classList.add('card-body', 'd-flex', 'align-items-center', 'justify-content-center', 'text-center');
        this.spinnerElement.innerHTML = this.loaderHtml;
        this.itemsContainer.innerHTML = '';
        this.itemsContainer.append(this.spinnerElement);
    }
    showItemSpinner(item) {
        // TODO Add item spinner
    }
    displayMessage(message, errorOccured) {
        let error = document.createElement('div');
        error.classList.add('text-muted', 'text-center');
        error.innerHTML = message;
        let container = document.createElement('div');
        container.classList.add('card-body');
        container.append(error);
        if (errorOccured) {
            this.containerElement.innerHTML = '';
            this.containerElement.append(container);
        }
        else {
            this.itemsContainer.innerHTML = '';
            this.itemsContainer.append(container);
        }
    }
}
//# sourceMappingURL=list-group-renderer.js.map