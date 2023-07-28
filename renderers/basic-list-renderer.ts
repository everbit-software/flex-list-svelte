import { AbstractRenderer, ListStyle, RendererConfig } from "./abstract-renderer";
import { ListItem } from "../list-item";

interface ListRenderConfig extends RendererConfig {
    renderItem: (item: ListItem) => string;
    isOrdered?: boolean;
}

export class BasicListRenderer extends AbstractRenderer {
    // List renderer
    private renderItem: (item: ListItem) => string;
    private list: HTMLUListElement | HTMLOListElement;
    private isOrdered: boolean = false;

    constructor(config: ListRenderConfig) {
        super(config);

        this.renderItem = config.renderItem;
        this.isOrdered = config.isOrdered ?? false;
    }

    public setup() {
        // (Un)ordered list
        this.list = document.createElement(this.isOrdered ? 'ol' : 'ul');

        // Add table to the container
        this.containerElement.innerHTML = '';
        this.containerElement.append(this.list);
    }

    createItemElement(item: ListItem): HTMLElement {
        const li = document.createElement('li');

        li.innerHTML = this.renderItem(item);

        return li;
    }

    addItemToContainer(item: ListItem) {
        this.list.append(item.element as HTMLElement);
    }

    clearItems() {
        this.list.innerHTML = '';
    }

    setupSpinner(): void {

    }

    private getSpinnerElement() {
        let li = document.createElement('li');
        li.innerHTML = this.loaderHtml;

        return li;
    }

    toggleSpinner(show: boolean) {
        if (show) {
            this.list.innerHTML = '';
            this.list.append(this.getSpinnerElement());
        }
    }

    showItemSpinner(item: ListItem) {
        if (!item.element) {
            return;
        }

        item.element.innerHTML = '';
        item.element.append(this.getSpinnerElement());
    }

    displayMessage(message: string, errorOccured: boolean) {
        let li = document.createElement('li');
        li.innerHTML = message;
    }
}