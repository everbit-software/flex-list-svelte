import { AbstractRenderer } from "./abstract-renderer";
export const BootstrapFiveStyle = {
    tableContainer: ['table-responsive'],
    table: ['table', 'table-sm', 'table-hover', 'table-nowrap', 'card-table'],
    thead: ['table', 'table-sm', 'table-nowrap', 'card-table'],
    // th: [],
    // td: [],
};
export class TableRenderer extends AbstractRenderer {
    // Table renderer
    columns = [];
    rowsContainer;
    constructor(config) {
        super(config);
        this.style = config.style ?? BootstrapFiveStyle;
        // Add columns (and default values
        for (const column of config.columns) {
            column.isVisible = column.isVisible ?? true;
            this.columns.push(column);
        }
    }
    generateTableHeader() {
        // Table head
        const thead = document.createElement('thead');
        thead.classList.add(...this.style.thead);
        // Table header row
        const tr = document.createElement('tr');
        thead.append(tr);
        for (const column of this.columns) {
            const th = document.createElement('th');
            if (this.style.th !== undefined) {
                th.classList.add(...this.style.th);
            }
            th.innerText = column.label;
            th.dataset.columnKey = column.key;
            if (!column.isVisible) {
                th.style.display = 'none';
            }
            tr.append(th);
        }
        return thead;
    }
    generateTableBody() {
        return document.createElement('tbody');
    }
    /*private generateTableFooter() {
        const tfoot = document.createElement('tfoot');

        return tfoot;
    }*/
    setup() {
        // Table responsive container
        const tableContainer = document.createElement('div');
        this.containerElement.append(tableContainer);
        tableContainer.classList.add(...this.style.tableContainer);
        // Table element
        let table = document.createElement('table');
        tableContainer.append(table);
        table.classList.add(...this.style.table);
        // Table children
        let tableHeader = this.generateTableHeader();
        let tableBody = this.generateTableBody();
        // let tableFooter = this.generateTableFooter();
        table.append(tableHeader, tableBody /*, tableFooter*/);
        this.rowsContainer = tableBody;
        // Add table to the container
        this.containerElement.innerHTML = '';
        this.containerElement.append(tableContainer);
    }
    createItemElement(item) {
        const row = document.createElement('tr');
        for (const column of this.columns) {
            const td = document.createElement('td');
            if (this.style.td !== undefined) {
                td.classList.add(...this.style.td);
            }
            let columnValue = item.data[column.key];
            if (column.displayCallback !== undefined) {
                columnValue = column.displayCallback(columnValue);
            }
            td.innerText = columnValue;
            td.dataset.columnKey = column.key;
            if (!column.isVisible) {
                td.style.display = 'none';
            }
            row.append(td);
        }
        return row;
    }
    addItemToContainer(item) {
        this.rowsContainer.append(item.element);
    }
    clearItems() {
        this.rowsContainer.innerHTML = '';
    }
    setupSpinner() {
    }
    getRowSpinner() {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = this.columns.length;
        const spinner = document.createElement('div');
        spinner.style.display = 'flex';
        spinner.style.justifyContent = 'center';
        spinner.innerHTML = this.loaderHtml;
        cell.append(spinner);
        row.append(cell);
        return row;
    }
    toggleSpinner(show) {
        if (show) {
            this.rowsContainer.innerHTML = '';
            this.rowsContainer.append(this.getRowSpinner());
        }
    }
    showItemSpinner(item) {
        if (!item.element) {
            return;
        }
        item.element.innerHTML = '';
        item.element.append(this.getRowSpinner());
    }
    displayMessage(message, errorOccured) {
        let error = document.createElement('div');
        error.classList.add('text-muted', 'text-center');
        error.innerHTML = message;
        if (errorOccured) {
            let container = document.createElement('div');
            container.classList.add('card-body');
            container.append(error);
            this.containerElement.innerHTML = '';
            this.containerElement.append(container);
        }
        else {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = this.columns.length;
            cell.append(error);
            row.append(cell);
            this.rowsContainer.innerHTML = '';
            this.rowsContainer.append(row);
        }
    }
}
//# sourceMappingURL=table-renderer.js.map