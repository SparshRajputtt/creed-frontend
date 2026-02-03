//@ts-nocheck
import { atom } from "jotai";
import type { User } from "../types/auth";
import { authStorage, userStorage } from "../utils/storage";

// Auth state atoms
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const isLoadingAuthAtom = atom<boolean>(true);

// Derived atoms
export const isAdminAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role === "admin";
});

export const userFullNameAtom = atom((get) => {
  const user = get(userAtom);
  return user ? `${user.firstName} ${user.lastName}` : "";
});

// Auth actions
export const loginAtom = atom(
  null,
  (
    get,
    set,
    {
      user,
      token,
      refreshToken,
    }: { user: User; token: string; refreshToken?: string }
  ) => {
    set(userAtom, user);
    set(isAuthenticatedAtom, true);
    set(isLoadingAuthAtom, false);

    authStorage.setTokens(token, refreshToken);
    userStorage.setUser(user);
  }
);

export const logoutAtom = atom(null, (get, set) => {
  set(userAtom, null);
  set(isAuthenticatedAtom, false);
  set(isLoadingAuthAtom, false);

  authStorage.clearTokens();
  userStorage.clearUser();
});

export const updateUserAtom = atom(null, (get, set, user: User) => {
  set(userAtom, user);
  userStorage.setUser(user);
});

// Initialize auth state from storage
export const initializeAuthAtom = atom(null, (get, set) => {
  const hasToken = authStorage.hasValidToken();
  const storedUser = userStorage.getUser();

  if (hasToken && storedUser) {
    set(userAtom, storedUser);
    set(isAuthenticatedAtom, true);
  }

  set(isLoadingAuthAtom, false);
});
