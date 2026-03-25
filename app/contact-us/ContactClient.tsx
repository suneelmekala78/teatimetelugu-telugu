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
import { submitContact } from "@/lib/requests-client";
import { toast } from "sonner";
import styles from "./contact.module.css";

export default function ContactClient() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const res = await submitContact(data);

      if (res.data?.success) {
        toast.success(res.data.message || "సందేశం విజయవంతంగా పంపబడింది!");
        setData({ fullName: "", email: "", subject: "", message: "" });
      } else {
        toast.error(res.data?.message || "ఏదో తప్పు జరిగింది!");
      }
    } catch {
      toast.error("సర్వర్ లోపం!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TabTitle title="మమ్మల్ని సంప్రదించండి" />

      <div className={styles.page}>
        <div className={styles.container}>
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
              <a href="https://www.facebook.com/profile.php?id=61582469079953" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://www.youtube.com/@TeaTimeTelugu-eet" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://x.com/TeaTimeTelugu" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
              <a href="https://www.instagram.com/teatime_telugu/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input name="fullName" placeholder="పూర్తి పేరు" value={data.fullName} onChange={handleChange} />
            <input name="email" type="email" placeholder="ఇ-మెయిల్" value={data.email} onChange={handleChange} />
            <input name="subject" placeholder="విషయం" value={data.subject} onChange={handleChange} />
            <textarea name="message" placeholder="సందేశం" rows={5} value={data.message} onChange={handleChange} />
            <button disabled={loading}>{loading ? "పంపుతోంది..." : "సందేశం పంపండి"}</button>
          </form>
        </div>
      </div>
    </>
  );
}
