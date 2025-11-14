import { useState, useEffect } from "react";
import axios from "axios";

const USER_API = "http://localhost:8080/api/v1/user";

const useGetProfile = () => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                axios.defaults.withCredentials=true;
                const res = await axios.get(`${USER_API}/profile`); 
                if(res.data.success){
                    setUserProfile(res.data.user);
                }
            } catch (error) {
                console.log(error);
            } 
        }
        fetchUserProfile();
    },[]);

    return userProfile;
};

export default useGetProfile;