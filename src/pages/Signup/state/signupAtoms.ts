//@ts-nocheck
import { atom } from "jotai"

export interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  otp: string
}

export const signupFormAtom = atom<SignupFormData>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  otp: "",
})

export const signupStepAtom = atom<"form" | "otp">("form")
export const otpSentAtom = atom<boolean>(false)
