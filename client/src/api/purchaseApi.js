import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "https://lms-u5w9.onrender.com/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: COURSE_PURCHASE_API }),
  endpoints: (builder) => ({
    purchaseCourse: builder.mutation({
      query: (courseId) => ({
        url: "/course",
        method: "POST",
        body: courseId,
        credentials: "include",
      }),
      invalidatesTags: (result, error, arg) => [
        "PurchasedCourses",
        { type: "CourseStatus", id: arg.courseId },
      ],
    }),
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) => ({
        url: `/courses/${courseId}/details-with-status`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, courseId) => [
        { type: "CourseStatus", id: courseId },
      ],
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["PurchasedCourses"],
    }),
  }),
  tagTypes: ["PurchasedCourses", "CourseStatus"],
});

export const {
  usePurchaseCourseMutation,
  useGetCourseDetailsWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;