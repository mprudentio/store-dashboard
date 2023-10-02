import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  categories: [],
  error: null,
};

//GET
export const getCategories = createAsyncThunk(
  "getCategories",
  async (uid, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/categories?uid=${uid}`
      );
      const result = response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//POST
export const postCategories = createAsyncThunk(
  "postCategories",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//EDIT
export const editCategories = createAsyncThunk(
  "editCategories",
  async ({ id, category, uid }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: category, uid: uid }),
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//DELETE
export const deleteCategories = createAsyncThunk(
  "deleteCategories",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`${import.meta.env.VITE_API_KEY}/categories/${id}`, {
        method: "DELETE",
      });
      return { id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const listCategories = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(postCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(postCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
    });
    builder.addCase(postCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(editCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
    });
    builder.addCase(editCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(deleteCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCategories.fulfilled, (state, action) => {
      state.loading = false;
      const deleteCategoryId = action.payload.id;
      state.categories = state.categories.filter(
        (category) => category.id !== deleteCategoryId
      );
    });
    builder.addCase(deleteCategories, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default listCategories.reducer;
