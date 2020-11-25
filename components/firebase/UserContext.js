import { createContext, useEffect, useState } from "react";

import firebase from "./../../lib/firebase";

const UserContext = createContext({});

export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);

  function login() {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  function logout() {
    firebase.auth().signOut();
  }

  useEffect(() => {
    const unsubscribeAuthChangeListener = firebase
      .auth()
      .onAuthStateChanged((userSnap) => {
        setUser(userSnap);
      });

    return () => {
      unsubscribeAuthChangeListener();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ user, initialized: user !== undefined, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
