import axios from "axios";
import { useAuthStore } from "../store";
import { HOSTNAME } from "../config";

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);


    
    const login = async (username, password) => {
        try {
        const response = await axios.post(HOSTNAME+"/auth/a/login", {
            username,
            password,
        }, { withCredentials: true });
        setUser(response.data);
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return response;
        } catch (error) {
        console.error(error);
        }
    };
    

    const logoutUser =  () => {
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    
    return { user, login, Logout: logoutUser };
 };