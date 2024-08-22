import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setProducts(state, action) {
      state.products = action.payload;
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setProducts, setError } = productSlice.actions;
export default productSlice.reducer;

export const fetchProducts = () => async (dispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.get('http://localhost:3000/api/products/getproducts');
      dispatch(setProducts(response.data.data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };


