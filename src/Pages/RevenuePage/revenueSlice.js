import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    loading:false,
   revenue:[],
    error:''
}
//GET
export const getRevenue = createAsyncThunk("getRevenue",async (_, { rejectWithValue, })=>{
    try{
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/sales`)
        const result = await response.json()
        return result
    }catch(error){
        throw rejectWithValue(error)
    }
})


// POST
export const postRevenue = createAsyncThunk("postRevenue",async({date,products,price},{rejectWithValue})=>{
    try{
        const productsWithoutId = products.map(product => {
            // eslint-disable-next-line no-unused-vars
            const { id, ...rest } = product;
            return rest;
          });
        //   console.log(productsWithoutId)
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/sales`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, price, products: productsWithoutId }),
          });
        
      
        const responseData = await response.json();
        return responseData;
    }catch(error){
        return rejectWithValue(error)
    }
})

//EDIT
export const editRevenue = createAsyncThunk("editRevenue",async({id,date,products,price},{rejectWithValue})=>{
    try{
        const productsWithoutId = products.map(product => {
            // eslint-disable-next-line no-unused-vars
            const { id, ...rest } = product;
            return rest;
          });
        //   console.log(productsWithoutId)
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/sales/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, price, products: productsWithoutId }),
          });
        
      
        const responseData = await response.json();
        return responseData;
    }catch(error){
        return rejectWithValue(error)
    }
})

//DELETE

export const deleteRevenue = createAsyncThunk("deleteRevenue", async(id,{rejectWithValue})=>{
    // console.log(id)
    try{
         await fetch(`${import.meta.env.VITE_API_KEY}/sales/${id}`,{
            method:"DELETE",
        })
        return { id }
    }catch(error){
        return rejectWithValue(error);
    }
})
export const listRevenue = createSlice({
    name:'sales',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(getRevenue.pending, (state)=>{
            state.loading=true
        }),
        builder.addCase(getRevenue.fulfilled, (state,action)=>{
            state.loading=false
            state.revenue=action.payload
        }),
        builder.addCase(getRevenue.rejected, (state,action)=>{
            state.loading=false
            state.error=action.payload.message
        }),
        builder.addCase(postRevenue.pending, (state)=>{
            state.loading=true
        }),
        builder.addCase(postRevenue.fulfilled, (state,action)=>{
            state.loading=false
            state.revenue.push(action.payload)
        }),
        builder.addCase(postRevenue.rejected, (state,action)=>{
            state.loading=false
            state.error=action.payload.message
        }),
        builder.addCase(editRevenue.pending, (state) =>{
            state.loading=true
        })
        builder.addCase(editRevenue.fulfilled, (state,action) =>{
            state.loading = false;
            state.revenue = state.revenue.map((product) =>
                product.id === action.payload.id ? action.payload : product
            );
        })
        builder.addCase(editRevenue.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload.message
        })
        builder.addCase(deleteRevenue.pending, (state) =>{
            state.loading=true
        })
        builder.addCase(deleteRevenue.fulfilled, (state,action) =>{
            state.loading = false;
            const deleteRevenueId = action.payload.id;
            state.revenue = state.revenue.filter((product) => product.id !== deleteRevenueId);
            
        })
        builder.addCase(deleteRevenue.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload.message
        })

    }
})

export default listRevenue.reducer