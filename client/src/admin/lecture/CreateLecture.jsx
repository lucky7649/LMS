import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateLectureMutation, useGetLecturesByCourseIdQuery } from "@/api/courseApi";
import { toast } from "sonner";
import Lecture from "./Lecture";
import { useDispatch } from "react-redux";
import { addLecture } from "@/features/courseSlice";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all lectures by course id
  const {
    data: lecturesData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch
  } = useGetLecturesByCourseIdQuery(courseId, { refetchOnMountOrArgChange: true });

  // Add lectures
  const [createLecture, { data, isLoading, isSuccess, isError, error }] = useCreateLectureMutation();

  const createLectureHandler = async () => {
    // Trim whitespace and validate
    const trimmedTitle = lectureTitle.trim();
    
    if (!trimmedTitle) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    try {
      await createLecture({ courseId, lectureTitle: trimmedTitle }).unwrap();
    } catch (err) {
      console.error("Failed to create lecture:", err);
      toast.error(err?.data?.message || "Failed to create lecture");
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      refetch();
      setLectureTitle("");
      toast.success(data?.message || "Lecture created.");
      dispatch(addLecture(data.lecture));
    }
  }, [data, isSuccess, refetch, dispatch]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      createLectureHandler();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <div>
        <Label>Title</Label>
        <Input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Your Lecture Title Name"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-2 my-5">
        <Link to={`/admin/course/${courseId}`}>
          <Button variant="outline" disabled={isLoading}>
            Back to course
          </Button>
        </Link>
        <Button disabled={isLoading || !lectureTitle.trim()} onClick={createLectureHandler}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create Lecture"
          )}
        </Button>
      </div>

      {/* Display all lectures here */}
      <div className="mt-10">
        {lectureLoading ? (
          <p>Loading lectures...</p>
        ) : lectureError ? (
          <p>Failed to load lectures.</p>
        ) : !lecturesData?.lectures?.length ? (
          <p>No lectures available.</p>
        ) : (
          lecturesData.lectures.map((lecture, index) => (
            <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default CreateLecture;