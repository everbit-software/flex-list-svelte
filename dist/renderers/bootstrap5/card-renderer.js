import { AbstractRenderer } from "../abstract-renderer";
export class CardRenderer extends AbstractRenderer {
    itemsContainer;
    renderRow;
    renderItemSpinner;
    columnClasses;
    constructor(config) {
        super(config);
        this.renderRow = config.renderRow;
        this.renderItemSpinner = config.renderItemSpinner;
        this.columnClasses = config.columnClasses ?? ['col-12'];
    }
    setup() {
        // Card body
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Items container (inside card body)
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.classList.add('row');
        cardBody.append(this.itemsContainer);
        // Add table to the container
        this.containerElement.innerHTML = '';
        this.containerElement.append(cardBody);
    }
    createItemElement(item) {
        let elementOrString = this.renderRow(item);
        let itemElement;
        if (elementOrString instanceof HTMLElement) {
            itemElement = elementOrString;
        }
        else {
            let element = document.createElement('div');
            element.innerHTML = elementOrString;
            itemElement = element.firstElementChild;
        }
        // Create column
        let column = document.createElement('div');
        column.classList.add(...this.columnClasses);
        column.append(itemElement);
        return column;
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
        this.itemsContainer.innerHTML = `<div class="col">${this.loaderHtml}</div>`;
    }
    showItemSpinner(item) {
        // TODO Add item spinner
    }
    displayMessage(message, errorOccured) {
        // Error element
        let error = document.createElement('div');
        error.classList.add('card-body', 'text-muted', 'text-center');
        error.innerHTML = message;
        // Card
        let card = document.createElement('div');
        card.classList.add('card');
        card.append(error);
        // Container
        let container = document.createElement('div');
        container.classList.add('col');
        container.append(card);
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
//# sourceMappingURL=card-renderer.js.map