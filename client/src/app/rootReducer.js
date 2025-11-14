import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "@/features/authSlice";
import courseSlice from "@/features/courseSlice";
import { authApi } from "@/api/authApi";
import { courseApi } from "@/api/courseApi";
import { purchaseApi } from "@/api/purchaseApi";
import { courseProgressApi } from "@/api/courseProgressApi";


const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
  auth: authSlice,
  course:courseSlice
});

export default rootReducer;
