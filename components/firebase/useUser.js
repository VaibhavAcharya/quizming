import { useContext } from "react";
import UserContext from "./UserContext";

export default function useUser() {
  const { user, initialized, login, logout } = useContext(UserContext);
  return { user, initialized, login, logout };
}
