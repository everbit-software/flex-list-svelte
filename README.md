# Flex Lists

Create lists with remote data easily with options for pagination, searching and customising rendering.

Unlike other list libraries, flex-list focuses on customisation, allowing you to get your lists exactly how you would like them.

Lists have several common components
- Renderer: This is what is used to generate the HTML inside the list container. There are some included in the library by default including `BasicListRenderer`, `TableRenderer`, Bootstrap 5 `CardRenderer` and Bootstrap 5 `ListGroupRenderer`. You can create your own renderers by extending the `AbstractRenderer`
- Item callbacks: These are what get the remote data, at a minimum you need the `load` callback but others can be added when needed.
- ID field: This is how each row will be identified

Pages and items are cached, so if you change page and come back to it, the page will not need to be repulled. 

## Basic Example

Each list will need an element for where the items will be renderered (`containerElement` in the config). Optionally, you can add a search element, on change this will trigger a search call.

This example uses Bootstrap 5 syntax, but the library will work with any CSS framework, just replace the classes with the ones used in the library you're using.

```html
<input type="text" class="form-control mb-2" placeholder="Search..." id="basicSearch">

<div id="basicContainer"></div>
```

At a bare minimum, the `FlexList` requires a renderer (`renderer`) to create the HTML/DOM for the list, an ID field (`idField`) to identify each row by and at least one load callback (`itemCallbacks`).

For all renderers, you will need to specify a `containerElement`, this is the one specified in the HTML above. The `BasicListRenderer` also requires a `renderItem` callback, this will be used to create the HTML.

Since we have a search input in the HTML, we can also add `search` to the config specifing the `inputElement` and the `fields` to search. The rest of the customisation is done through the `itemCallbacks.search` callback.

```ts
import FlexList from "@everbit-software/flex-list/src/flex-list";
import { ListItem } from "@everbit-software/flex-list/src/list-item";
import { Product, getRows } from "../dummy-api";
import { BasicListRenderer } from "@everbit-software/flex-list/src/renderers/basic-list-renderer";
import { Search } from "@everbit-software/flex-list/src/search";

const basicContainer = document.querySelector('#basicContainer') as HTMLDivElement;
const search = document.querySelector('#basicSearch') as HTMLInputElement;

let list = new FlexList({
    renderer: new BasicListRenderer({
        containerElement: basicContainer,
        renderItem: (item: ListItem) => {
            let product = item.data as Product;

            return product.title;
        }
    }),
    search: new Search({
        inputElement: search,
        fields: ['title']
    }),
    itemCallbacks: {
        load: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
    },
    idField: 'id',
    noItemsText: 'There are currently no items.'
});
```

## To Do
- [x] Enable/disable search
- [x] Custom renderers: Render the list to your needs with custom renderers, as well as built in ones like the `TableRenderer`
- [x] Pagination
  - [ ] Ability to disable it
- [ ] Custom loaders: By default, the list will use numbers as pages. But this could add the ability to change the 
  behaviour of the list, such as using date ranges. Say each page could show a month, and changing the pages would 
  change the month to fit the data. 
- [x] Themes
  - [x] No framework
  - [x] Bootstrap 5