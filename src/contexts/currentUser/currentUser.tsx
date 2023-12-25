import React from "react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateBase64Id } from "../../lib/persistence/id";
import posthog from "posthog-js";

export interface CurrentUserContextContent {
  user: User | null;
}

export interface User {
  id: string;
}

const STORAGE_KEY = "currentUser";
const ID_LENGTH = 22;

function getFromLocalStorage(window: Window) {
  let storedUser: User;
  try {
    storedUser = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "");
  } catch {
    storedUser = { id: generateBase64Id(ID_LENGTH) };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUser));
  }
  return storedUser;
}

export const CurrentUserContext = createContext<CurrentUserContextContent>({
  user: null,
});

export const CurrentUserContextProvider = (props: PropsWithChildren<{}>) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const addEmail = (email: string) => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        email,
      };
      setCurrentUser(updated);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      posthog.identify(currentUser.id, { email });
    }
  };
  useEffect(() => {
    if (currentUser === null) {
      setCurrentUser(getFromLocalStorage(window));
    }
  }, [currentUser]);

  return (
    <CurrentUserContext.Provider
      value={{
        user: currentUser,
      }}
    >
      {props.children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => useContext(CurrentUserContext);
