import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector,
} from "react-redux";
import { AppDispatch, RootState } from "../store";

export type Action<P = unknown> = {
  type: string;
  payload?: P;
};

export type Dispatch = <P = unknown>(action: Action<P>) => void;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = (): AppDispatch => useReduxDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
