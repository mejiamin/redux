import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelectore = useSelector.withTypes<RootState>()
