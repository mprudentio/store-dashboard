import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState={
    loading: false,
    products:[],
    error:null
}

//GET
export const getProducts = createAsyncThunk("getProducts", async (uid, { rejectWithValue }) => {
    try {
        // console.log(uid)
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/products?uid=${uid}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

//POST 
export const createProducts = createAsyncThunk("createProducts", async(data,{rejectWithValue})=>{
    try{
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/products`,{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return result
    }catch(error){
        return rejectWithValue(error);
    }
})
//DELETE
export const deleteProduct = createAsyncThunk("deleteProduct", async(id,{rejectWithValue})=>{
    console.log(id)
    try{
         await fetch(`${import.meta.env.VITE_API_KEY}/products/${id}`,{
            method:"DELETE",
        })
        return { id }
    }catch(error){
        return rejectWithValue(error);
    }
})
//UPDATE
export const updateProducts = createAsyncThunk("updateProducts", async({id,data},{rejectWithValue})=>{
    try{
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/products/${id}`,{
            method:"PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return result
    }catch(error){
        return rejectWithValue(error);
    }
})
// export const updateProducts = createAsyncThunk(
//     "updateProducts",
//     async ({ id, data }, { rejectWithValue }) => {
//       try {
//         const response = await fetch(`http://localhost:3000/products/${id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         });
//         const result = await response.json();
//         return { id, data: result }; // Include the updated data in the action payload
//       } catch (error) {
//         return rejectWithValue(error);
//       }
//     }
//   );
  
export const listProducts = createSlice({
    name:"listProducts",
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(getProducts.pending, (state) =>{
            state.loading=true
        })
        builder.addCase(getProducts.fulfilled, (state,action) =>{
            state.loading=false
            state.products=action.payload
        })
        builder.addCase(getProducts.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload.message
        })
        builder.addCase(createProducts.pending, (state) =>{
            state.loading=true
        })
        builder.addCase(createProducts.fulfilled, (state,action) =>{
            state.loading=false
            state.products.push(action.payload)
        })
        builder.addCase(createProducts.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload.message
        })
        builder.addCase(updateProducts.pending, (state) =>{
            state.loading=true
        })
        builder.addCase(updateProducts.fulfilled, (state,action) =>{
            state.loading = false;
            state.products = state.products.map((product) =>
                product.id === action.payload.id ? action.payload : product
            );
        })
        builder.addCase(updateProducts.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload.message
        })
        builder.addCase(deleteProduct.pending, (state) =>{
            state.loading=true
        })
        builder.addCase(deleteProduct.fulfilled, (state,action) =>{
            state.loading = false;
            const deletedProductId = action.payload.id;
            state.products = state.products.filter((product) => product.id !== deletedProductId);
            
        })
        builder.addCase(deleteProduct.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload.message
        })
    }

})

export default listProducts.reducer