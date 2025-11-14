import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { useLoadUserQuery } from "./api/authApi.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

const Custom = ({children}) => {
  const {isLoading} = useLoadUserQuery();
  return (
    <>
    {
      isLoading ? <LoadingSpinner/> : <>{children}</>
    }
    </>
  )
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
      <App /> 
      </Custom>
      <Toaster />
    </Provider>
  </StrictMode>
);


 


