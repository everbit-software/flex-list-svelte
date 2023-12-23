import { Readable, Writable, get, readable, writable } from "svelte/store";

export interface Option {
    id: string;
    label?: string;
    value?: any;
}

export class Options {
    private options: Writable<Option[]> = writable([]);
  
    constructor(initialOptions: Option[]) {
        this.updateAll(initialOptions);
        return this;
    }

    public updateAll(options: Option[]) {
        this.options.set(options);
    }
  
    public get(id: string): any {
        return get(this.options).find(option => option.id === id)?.value;
    }
  
    public set(id: string, value: any): void {
        this.options.update((options) => {
            const index = options.findIndex(option => option.id === id);
    
            if (index !== -1) {
                options[index].value = value;
            } else {
                options.push({
                    id: id,
                    value: value
                })
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
    public readable(id: string): Readable<any> {
        const initialValue = this.get(id);
        
        let store = readable(initialValue, (set) => {
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

    /**
     * Subscribe to an option change
     *
     * @param id 
     *
     * @returns 
     */
    public writable(id: string, defaultValue?: any): Writable<any> {
        let store = writable(this.get(id) ?? defaultValue ?? null);
        let changingValue = false;

        this.options.subscribe((options) => {
            const currentValue = get(store);

            for (const option of options) {
                if (option.id !== id || currentValue === option.value) {
                    continue
                }

                changingValue = true;
                store.set(option.value);
                changingValue = false;
            }
        });

        store.subscribe((value) => {
            if (!changingValue) {
                this.set(id, value);
            }
        });

        return store
    }
  
    public all(): Option[] {
        return get(this.options);
    }
}