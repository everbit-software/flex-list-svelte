# Flex Lists

Create lists with remote data easily with options for pagination, searching and customising rendering.

Unlike other list libraries, flex-list focuses on customisation, allowing you to get your lists exactly how you would like them.

The library works by binding different buttons and inputs to functions in the `FlexList` class. This allows you to customise how you would like the list.

## Basic Example

```svelte
<script lang="ts">
    import type { PageData } from "./$types";
    import LoadingSpinner from "@/components/LoadingSpinner.svelte";
    import FlexList from "@/lib/flex-list-svelte/src/flex-list";
    import { Search } from "@/lib/flex-list-svelte/src/search";
    import { get } from "svelte/store";

    export let data: PageData;

    const flexList = new FlexList({
        idField: "id",
        sortColumn: "name",
        perPage: 20,
        itemCallbacks: {
            load: async (page: number, limit: number) => {
		// Get items
                return await api.getOrganisations(page, limit);
            },
        },
    });

    const { displayedItems, displayedMessage, showSpinner } = flexList;
</script>

<div class="list-group list-group-flush">
        {#if $showSpinner}
            <div class="d-flex justify-content-center py-3">
                <LoadingSpinner />
            </div>
        {:else if $displayedMessage}
            <div class="d-flex justify-content-center py-3">
                {@html $displayedMessage}
            </div>
        {:else}
            {#each $displayedItems as organisation}
                <a
                    class="list-group-item"
                    href="/organisation/{organisation.id}"
                    >{organisation.data.name}</a
                >
            {/each}
            <!-- {:catch}
            <div class="list-group-item">
                An error occured while fetching the data...
            </div> -->
        {/if}
    </div>
```
