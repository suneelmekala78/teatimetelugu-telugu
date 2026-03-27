"use client";

import styles from "./AuthPopup.module.css";
import { useEffect, useCallback, useRef, useState, type FormEvent } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import {
  loginUser,
  registerUser,
  verifyRegistration,
  googleAuth,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "@/lib/requests-client";

interface Props {
  open: boolean;
  onClose: () => void;
}

type View = "login" | "register" | "forgot" | "otp" | "reset";
type OtpPurpose = "register" | "forgot";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function AuthPopup({ open, onClose }: Props) {
  const router = useRouter();
  const { login } = useUserStore();
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const [view, setView] = useState<View>("login");
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>("forgot");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Reset state when popup opens/closes
  useEffect(() => {
    if (open) {
      setView("login");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setShowPassword(false);
      setOtpPurpose("forgot");
    }
  }, [open]);

  const handleSuccess = (data: { accessToken: string; user: any }) => {
    login(data.user, data.accessToken);
    toast.success("విజయవంతంగా లాగిన్ అయ్యారు!");
    onClose();
    router.refresh();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      const res = await loginUser({ email: email.trim(), password });
      if (res.data?.success) handleSuccess(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "లాగిన్ విఫలమైంది");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) return;
    if (password.length < 6) return toast.error("పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి");
    if (password !== confirmPassword) return toast.error("పాస్‌వర్డ్‌లు సరిపోలడం లేదు");
    setLoading(true);
    try {
      await registerUser({ fullName: fullName.trim(), email: email.trim(), password });
      toast.success("మీ ఈమెయిల్‌కు OTP పంపబడింది");
      setOtpPurpose("register");
      setOtpCode("");
      setView("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "రిజిస్ట్రేషన్ విఫలమైంది");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      toast.success("మీ ఈమెయిల్‌కు OTP పంపబడింది");
      setOtpPurpose("forgot");
      setOtpCode("");
      setView("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP పంపడం విఫలమైంది");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setLoading(true);
    try {
      if (otpPurpose === "register") {
        const res = await verifyRegistration({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          code: otpCode.trim(),
        });
        if (res.data?.success) handleSuccess(res.data);
      } else {
        await verifyOtp({ email: email.trim(), code: otpCode.trim() });
        toast.success("OTP ధృవీకరించబడింది");
        setView("reset");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "చెల్లని OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      if (otpPurpose === "register") {
        await registerUser({ fullName: fullName.trim(), email: email.trim(), password });
      } else {
        await forgotPassword({ email: email.trim() });
      }
      toast.success("OTP మళ్ళీ పంపబడింది");
    } catch {
      toast.error("OTP పంపడం విఫలమైంది");
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password.length < 6) return toast.error("పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి");
    if (password !== confirmPassword) return toast.error("పాస్‌వర్డ్‌లు సరిపోలడం లేదు");
    setLoading(true);
    try {
      await resetPassword({ email: email.trim(), code: otpCode.trim(), newPassword: password });
      toast.success("పాస్‌వర్డ్ రీసెట్ విజయవంతం. దయచేసి లాగిన్ అవ్వండి.");
      setPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setView("login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "రీసెట్ విఫలమైంది");
    } finally {
      setLoading(false);
    }
  };

  /* ── Google Sign-In ── */

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await googleAuth({ idToken: response.credential });
        if (res.data?.success) handleSuccess(res.data);
        else toast.error(res.data?.message || "లాగిన్ విఫలమైంది");
      } catch {
        toast.error("లాగిన్ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [login, onClose, router],
  );

  useEffect(() => {
    if (!open || (view !== "login" && view !== "register")) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 300,
        text: "continue_with",
        locale: "te",
      });
    };

    if (window.google) {
      initializeGoogle();
      return;
    }

    if (!scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, [open, view, handleCredentialResponse]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const titles: Record<View, string> = {
    login: "లాగిన్",
    register: "ఖాతా సృష్టించండి",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా",
    otp: otpPurpose === "register" ? "ఈమెయిల్ ధృవీకరణ" : "OTP ధృవీకరణ",
    reset: "పాస్‌వర్డ్ రీసెట్",
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <IoClose size={22} />
        </button>

        <h2 className={styles.title}>{titles[view]}</h2>

        {/* ── LOGIN ── */}
        {view === "login" && (
          <>
            <div ref={buttonRef} className={styles.googleBtn} />

            <div className={styles.divider}><span>లేదా</span></div>

            <form onSubmit={handleLogin} className={styles.form}>
              <input
                type="email"
                placeholder="ఈమెయిల్"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                autoComplete="email"
              />
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="పాస్‌వర్డ్"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                </button>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "లాగిన్ అవుతోంది..." : "లాగిన్"}
              </button>
            </form>

            <button
              className={styles.linkBtn}
              onClick={() => { setView("forgot"); setPassword(""); }}
            >
              పాస్‌వర్డ్ మర్చిపోయారా?
            </button>

            <p className={styles.switchText}>
              ఖాతా లేదా?{" "}
              <button className={styles.switchBtn} onClick={() => { setView("register"); setPassword(""); setConfirmPassword(""); }}>
                రిజిస్టర్
              </button>
            </p>
          </>
        )}

        {/* ── REGISTER ── */}
        {view === "register" && (
          <>
            <div ref={buttonRef} className={styles.googleBtn} />

            <div className={styles.divider}><span>లేదా</span></div>

            <form onSubmit={handleRegister} className={styles.form}>
              <input
                type="text"
                placeholder="పూర్తి పేరు"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.input}
                required
                autoComplete="name"
              />
              <input
                type="email"
                placeholder="ఈమెయిల్"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                autoComplete="email"
              />
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                </button>
              </div>
              <input
                type="password"
                placeholder="పాస్‌వర్డ్ నిర్ధారించండి"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                autoComplete="new-password"
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "OTP పంపుతోంది..." : "రిజిస్టర్"}
              </button>
            </form>

            <p className={styles.switchText}>
              ఇప్పటికే ఖాతా ఉందా?{" "}
              <button className={styles.switchBtn} onClick={() => { setView("login"); setPassword(""); setConfirmPassword(""); }}>
                లాగిన్
              </button>
            </p>
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {view === "forgot" && (
          <>
            <p className={styles.desc}>వెరిఫికేషన్ కోడ్ పొందడానికి మీ ఈమెయిల్ నమోదు చేయండి.</p>
            <form onSubmit={handleForgotPassword} className={styles.form}>
              <input
                type="email"
                placeholder="ఈమెయిల్"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                autoComplete="email"
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "పంపుతోంది..." : "OTP పంపండి"}
              </button>
            </form>
            <button className={styles.linkBtn} onClick={() => setView("login")}>
              లాగిన్‌కు తిరిగి వెళ్ళండి
            </button>
          </>
        )}

        {/* ── VERIFY OTP ── */}
        {view === "otp" && (
          <>
            <p className={styles.desc}>
              <strong>{email}</strong> కు పంపిన 6-అంకెల కోడ్ నమోదు చేయండి
            </p>
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <input
                type="text"
                placeholder="OTP నమోదు చేయండి"
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpCode(val);
                }}
                className={`${styles.input} ${styles.otpInput}`}
                required
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <button type="submit" className={styles.submitBtn} disabled={loading || otpCode.length < 6}>
                {loading ? "ధృవీకరిస్తోంది..." : "ధృవీకరించండి"}
              </button>
            </form>
            <button className={styles.linkBtn} onClick={handleResendOtp}>
              OTP మళ్ళీ పంపండి
            </button>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {view === "reset" && (
          <>
            <p className={styles.desc}>మీ కొత్త పాస్‌వర్డ్ నమోదు చేయండి.</p>
            <form onSubmit={handleResetPassword} className={styles.form}>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="కొత్త పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                </button>
              </div>
              <input
                type="password"
                placeholder="పాస్‌వర్డ్ నిర్ధారించండి"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                autoComplete="new-password"
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "రీసెట్ చేస్తోంది..." : "పాస్‌వర్డ్ రీసెట్"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
