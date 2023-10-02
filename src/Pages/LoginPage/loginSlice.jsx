import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  email: null,
  loading: false,
  user: [],
  error: "",
};
//GET
export const getUser = createAsyncThunk(
  "getUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/users?uid=${id}`
      );
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
//PUT
export const editUser = createAsyncThunk(
  "editUser",
  async ({ id, uid, email, firstName, lastName, url }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, firstName, lastName, url, uid }),
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },
  },
  extraReducers: (build) => {
    build.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    build.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    build.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    build.addCase(editUser.pending, (state) => {
      state.loading = true;
    });
    build.addCase(editUser.fulfilled, (state, action) => {
      state.loading = false;
      const editUserId = action.payload.id;
      state.user = state.user.map((u) =>
        u.id === editUserId ? action.payload : u
      );
    });
    build.addCase(editUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { setActiveUser } = loginSlice.actions;
export default loginSlice.reducer;
