import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (searchText.trim() !== "") {
      navigate(`/course/search?query=${searchText}`);
    }
    setSearchText("");
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">Find the Best Courses for You</h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">Discover, Learn, and Upskill with our wide range of courses</p>
        
        <form onSubmit={onSubmitHandler} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
          <Input 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" 
            placeholder="Search Courses" 
          />
          <Button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">
            Search
          </Button>
        </form>

        <Button onClick={() => navigate(`/course/search?query`)} className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white px-6 py-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
