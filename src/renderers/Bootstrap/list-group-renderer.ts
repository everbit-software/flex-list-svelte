import { ListItem } from "../../list-item";
import { AbstractRenderer, RendererConfig } from "../abstract-renderer";

export interface ListGroupRendererConfig extends RendererConfig {
    renderRow: (item: ListItem) => HTMLElement | string;
    renderItemSpinner: (item: ListItem) => HTMLElement;
}

export class ListGroupRenderer extends AbstractRenderer {
    private itemsContainer: HTMLElement;
    private readonly renderRow: (item: ListItem) => HTMLElement | string;
    private readonly renderItemSpinner: (item: ListItem) => HTMLElement | string;

    constructor(config: ListGroupRendererConfig) {
        super(config);
        this.renderRow = config.renderRow;
        this.renderItemSpinner = config.renderItemSpinner;
    }

    setup(): void {
        // Items container
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.classList.add('list-group', 'list-group-lg', 'list-group-flush', 'list', 'my-n4');

        // Add table to the container
        this.containerElement.innerHTML = '';
        this.containerElement.append(this.itemsContainer);
    }

    createItemElement(item: ListItem): HTMLElement {
        let row = this.renderRow(item);

        if (row instanceof HTMLElement) {
            return row;
        } else {
            let element = document.createElement('div');
            element.innerHTML = row;
            return element.firstElementChild as HTMLElement;
        }
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

        this.spinnerElement = document.createElement('div');
        this.spinnerElement.classList.add('card-body', 'd-flex', 'align-items-center', 'justify-content-center', 'text-center');
        this.spinnerElement.innerHTML = this.loaderHtml;

        this.itemsContainer.innerHTML = '';
        this.itemsContainer.append(this.spinnerElement);
    }

    showItemSpinner(item: ListItem): void {
        // TODO Add item spinner
    }

    displayMessage(message: string, errorOccured: boolean): void {
        let error = document.createElement('div');
        error.classList.add('text-muted', 'text-center');
        error.innerHTML = message;

        let container = document.createElement('div');
        container.classList.add('card-body');
        container.append(error);

        if (errorOccured) {
            this.containerElement.innerHTML = '';
            this.containerElement.append(container);
        } else {
            this.itemsContainer.innerHTML = '';
            this.itemsContainer.append(container);
        }
    }
}