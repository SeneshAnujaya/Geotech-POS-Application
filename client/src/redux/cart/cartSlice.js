import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const existingItem = state.cartItems.find((item) => item.sku === action.payload.sku);

            if(existingItem) {
                existingItem.cartQuantity += 1;
            } else {
                state.cartItems.push({...action.payload, cartQuantity: 1});
            }
        },

        removeItemFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item.sku !== action.payload.sku);
        },
        increaseItemQuantity: (state, action) => {
            const item = state.cartItems.find((item) => item.sku === action.payload.sku);
            if(item) {
                item.cartQuantity += 1;
            }
        },
        decreaseItemQuantity: (state, action) => {
            const item = state.cartItems.find((item) => item.sku === action.payload.sku);
            if(item && item.cartQuantity > 1) {
                item.cartQuantity -= 1;
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
        }
    }
});

export const {addItemToCart, removeItemFromCart, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;