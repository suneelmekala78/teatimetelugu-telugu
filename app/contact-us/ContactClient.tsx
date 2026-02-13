"use client";

import { useState } from "react";
import TabTitle from "@/components/common/titles/TabTitle";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

import { contactUsEmail } from "@/lib/requests";
import { toast } from "react-toastify";
import styles from "./contact.module.css";

export default function ContactClient() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.fullName || !data.email || !data.subject || !data.message) {
      toast.error("దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి.");
      return;
    }

    try {
      setLoading(true);

      const res = await contactUsEmail(data);

      if (res?.status === "success") {
        toast.success(res?.message || "Message sent successfully!");
        setData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(res?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TabTitle title="మమ్మల్ని సంప్రదించండి" />

      <div className={styles.page}>
        <div className={styles.container}>
          {/* LEFT INFO */}
          <div className={styles.info}>
            <h2>సంప్రదించండి</h2>

            <p>టీ టైమ్ తెలుగు బృందం మీ అభిప్రాయాలు మరియు సూచనలను స్వాగతిస్తుంది.</p>

            <div className={styles.contactItem}>
              <FaEnvelope /> <span>info@eagleiitech.com</span>
            </div>

            <div className={styles.contactItem}>
              <FaPhone /> <span>(919) 439-6578</span>
            </div>

            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank">
                <FaFacebook />
              </a>
              <a href="https://youtube.com" target="_blank">
                <FaYoutube />
              </a>
              <a href="https://x.com" target="_blank">
                <FaXTwitter />
              </a>
              <a href="https://instagram.com" target="_blank">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="fullName"
              placeholder="పూర్తి పేరు"
              value={data.fullName}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="ఇ-మెయిల్"
              value={data.email}
              onChange={handleChange}
            />
            <input
              name="subject"
              placeholder="విషయం"
              value={data.subject}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="సందేశం"
              rows={5}
              value={data.message}
              onChange={handleChange}
            />

            <button disabled={loading}>
              {loading ? "పంపుతోంది..." : "సందేశం పంపండి"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
