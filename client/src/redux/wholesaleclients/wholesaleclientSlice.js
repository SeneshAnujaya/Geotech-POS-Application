import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const wholesaleClientSlice = createSlice({
  name: 'wholesaleClients',
  initialState: {
    wholesaleClients: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setWholesaleClients(state, action) {
      state.wholesaleClients = action.payload;
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setWholesaleClients, setError } = wholesaleClientSlice.actions;
export default wholesaleClientSlice.reducer;

export const fetchWholesaleClients = () => async (dispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.get('http://localhost:3000/api/wholesaleClient/getBulkBuyers');
      dispatch(setWholesaleClients(response.data.data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };



  


