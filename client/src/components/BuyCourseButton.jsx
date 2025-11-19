import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { usePurchaseCourseMutation } from "@/api/purchaseApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuyCourseButton = ({ courseId }) => {
  const navigate = useNavigate();
  const [purchaseCourse, { data, isLoading, isSuccess, isError, error }] =
    usePurchaseCourseMutation();

  const purchaseHandler = async () => {
    try {
      await purchaseCourse({ courseId });
    } catch (err) {
      console.error("Error purchasing course:", err);
    }
  };
 
  useEffect(() => {
    if (isSuccess) { 
      if (data?.success) {
        toast.success(data.message || "Course purchased successfully!");
        // Redirect to course progress page
        navigate(`/course-progress/${courseId}`);
      } else {
        toast.error("Invalid response from server.");
      }
    }
    if (isError) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to purchase course");
    }
  }, [data, isSuccess, isError, error, navigate, courseId]);

  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={purchaseHandler}
        className="bg-purple-500 w-full text-white hover:bg-purple-600 transition-colors px-4 py-2 rounded-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            Please wait
          </>
        ) : (
          "Buy Course Now"
        )}
      </Button>
    </div>
  );
};

export default BuyCourseButton;