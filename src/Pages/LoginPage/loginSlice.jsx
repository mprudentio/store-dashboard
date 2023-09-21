import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    uid:null,
    email:null
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:{
        setActiveUser:(state,action)=>{
            state.uid=action.payload.uid
            state.email=action.payload.email
        }
    }
   
})

export const {setActiveUser} = loginSlice.actions
export default loginSlice.reducer