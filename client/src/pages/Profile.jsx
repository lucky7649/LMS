import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import Course from "./Course";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLoadUserQuery, useUpdateProfileMutation } from "@/api/authApi";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data: userProfile, isLoading: profileLoading, refetch } = useLoadUserQuery();
  const [updateProfile, { data, isLoading, isError, isSuccess, error }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userProfile) setName(userProfile.user.name);
  }, [userProfile]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const profileUpdateHandle = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateProfile(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [isSuccess, isError, refetch, data, error]);

  if (profileLoading) return <ProfileSkeleton />;

  const { user } = userProfile;

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={user.photoUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full md:w-auto text-center md:text-left">
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.name}</span>
            </h2>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.email}</span>
            </h2>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">{user.role.toUpperCase()}</span>
            </h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="photo" className="text-right">Photo</Label>
                  <Input type="file" id="photo" accept="image/*" onChange={onChangeHandler} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                {isLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </Button>
                ) : (
                  <Button type="submit" onClick={profileUpdateHandle}>Save changes</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user.enrolledCourses.length === 0 ? (
            <h1 className="text-center">You haven't enrolled yet</h1>
          ) : (
            user.enrolledCourses.map((course) => <Course key={course._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Skeleton For Profile Page

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto my-10 px-4">
    <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
      <div className="flex flex-col items-center">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-24 w-24 md:h-32 md:w-32 mb-4 animate-pulse"></div>
      </div>
      <div className="w-full md:w-auto text-center md:text-left">
        <div className="mb-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            <span className="inline-block bg-gray-300 dark:bg-gray-700 h-6 w-48 ml-2 animate-pulse"></span>
          </h2>
        </div>
        <div className="mb-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            <span className="inline-block bg-gray-300 dark:bg-gray-700 h-6 w-64 ml-2 animate-pulse"></span>
          </h2>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-10 w-32 animate-pulse mx-auto md:mx-0"></div>
      </div>
    </div>
    <div>
      <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"></div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"></div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"></div>
      </div>
    </div>
  </div>
);
