import { ListItem } from "../../list-item";
import { AbstractRenderer, RendererConfig } from "../abstract-renderer";

export interface CardRendererConfig extends RendererConfig {
    columnClasses?: string[];
    renderRow: (item: ListItem) => HTMLElement | string;
    renderItemSpinner: (item: ListItem) => HTMLElement;
}

export class CardRenderer extends AbstractRenderer {
    private itemsContainer: HTMLElement;
    private readonly renderRow: (item: ListItem) => HTMLElement | string;
    private readonly renderItemSpinner: (item: ListItem) => HTMLElement | string;
    private readonly columnClasses: string[];

    constructor(config: CardRendererConfig) {
        super(config);
        this.renderRow = config.renderRow;
        this.renderItemSpinner = config.renderItemSpinner;
        this.columnClasses = config.columnClasses ?? ['col-12'];
    }

    setup(): void {
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

    createItemElement(item: ListItem): HTMLElement {
        let elementOrString = this.renderRow(item);
        let itemElement: HTMLElement;

        if (elementOrString instanceof HTMLElement) {
            itemElement = elementOrString;
        } else {
            let element = document.createElement('div');
            element.innerHTML = elementOrString;
            itemElement = element.firstElementChild as HTMLElement;
        }

        // Create column
        let column = document.createElement('div');

        column.classList.add(...this.columnClasses);
        column.append(itemElement);

        return column;
    }

    addItemToContainer(item: ListItem): void {
        this.itemsContainer.append(item.element as HTMLElement);
    }

    clearItems(): void {
        this.itemsContainer.innerHTML = '';
    }

    setupSpinner(): void {

    }

    toggleSpinner(show: boolean): void {
        if (!show) {
            return;
        }

        this.itemsContainer.innerHTML = `<div class="col">${this.loaderHtml}</div>`;
    }

    showItemSpinner(item: ListItem): void {
        // TODO Add item spinner
    }

    displayMessage(message: string, errorOccured: boolean): void {
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
        } else {
            this.itemsContainer.innerHTML = '';
            this.itemsContainer.append(container);
        }
    }
}