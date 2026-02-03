//@ts-nocheck
import type React from "react";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  signupFormAtom,
  signupStepAtom,
  otpSentAtom,
} from "../state/signupAtoms";
import { useRegister, useSendOTP } from "@/queries/hooks/auth/useAuth";
import { toast } from "react-hot-toast";

export const OTPVerification: React.FC = () => {
  const [formData, setFormData] = useAtom(signupFormAtom);
  const [, setStep] = useAtom(signupStepAtom);
  const [otpSent] = useAtom(otpSentAtom);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const registerMutation = useRegister();
  const sendOTPMutation = useSendOTP();

  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, otpSent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      otp: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (formData.otp.length !== 4) {
      toast.error("OTP must be 4 digits");
      return;
    }

    try {
      await registerMutation.mutateAsync(formData);
      navigate("/");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTPMutation.mutateAsync({ email: formData.email });
      setCountdown(60);
      setCanResend(false);
      toast.success("OTP sent successfully");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleBack = () => {
    setStep("form");
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to form
      </Button>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Verify your email</h3>
        <p className="text-sm text-muted-foreground">
          We've sent a 4-digit code to <strong>{formData.email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            placeholder="Enter 4-digit code"
            value={formData.otp}
            onChange={handleChange}
            maxLength={4}
            className="h-11 text-center text-lg tracking-widest"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-white my-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Create Account"
          )}
        </Button>
      </form>

      <div className="text-center">
        {canResend ? (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResendOTP}
            disabled={sendOTPMutation.isPending}
            className="text-sm"
          >
            {sendOTPMutation.isPending ? "Sending..." : "Resend OTP"}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Resend OTP in {countdown}s
          </p>
        )}
      </div>
    </div>
  );
};
