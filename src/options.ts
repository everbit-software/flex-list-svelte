import { Readable, Writable, get, readable, writable } from "svelte/store";

export interface Option {
    id: string;
    label?: string;
    value?: any;
}

export class Options {
    private options: Writable<Option[]> = writable([]);
  
    constructor(initialOptions: Option[]) {
      this.options.set(initialOptions);
    }
  
    get(id: string): any {
        return get(this.options).find(option => option.id === id)?.value;
    }
  
    set(id: string, value: any): void {
        this.options.update((options) => {
            const index = options.findIndex(option => option.id === id);
    
            if (index !== -1) {
                options[index].value = value;
            } else {
                console.error(`Option with id ${id} not found.`);
            }

            return options;
        })
    }

    /**
     * Subscribe to an option change
     *
     * @param id 
     *
     * @returns 
     */
    subscribe(id: string): Readable<any> {
        let store = readable(this.get(id), (set) => {
            this.options.subscribe((options) => {
                const currentValue = get(store);

                for (const option of options) {
                    if (option.id !== id || currentValue === option.value) {
                        continue
                    }

                    set(option.value);
                }
            })
        });

        return store
    }
  
    all(): Option[] {
        return get(this.options);
    }
}