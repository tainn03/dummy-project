import { useSelector } from "react-redux";
import { RootState } from "./store";

export const useAppState = () => useSelector((state: RootState) => state.app);
export const useAuthState = () => useSelector((state: RootState) => state.auth);
