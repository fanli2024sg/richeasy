import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";

import {
   InventoriesListTempleteActions, InventoryEditTempleteActions
} from "@actions/inventory";
import { Inventory } from "@entities/inventory";

export const featureKey = "inventory.entities";

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Inventory> {
    selectedInventoryId: string | null;
    loaded: boolean;
    loading: boolean;
    ids: string[];
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Inventory> = createEntityAdapter<Inventory>({
    selectId: (inventory: Inventory) => inventory.id,
    sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
    selectedInventoryId: null,
    loaded: false,
    loading: false,
    ids: []   
});

export const reducer = createReducer(
    initialState, 
    on(
        InventoriesListTempleteActions.selectListSuccess,
        (state, { inventories }) => adapter.upsertMany(inventories, state)
    ),
    on(
        InventoryEditTempleteActions.createSuccess,
        InventoryEditTempleteActions.updateSuccess,
        InventoriesListTempleteActions.createSuccess,
        InventoriesListTempleteActions.updateSuccess,
        (state, { inventory }) => adapter.upsertOne(inventory, state)
    )
);
export const selectId = (state: State) => state.selectedInventoryId;
