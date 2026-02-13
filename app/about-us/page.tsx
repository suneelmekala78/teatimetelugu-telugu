import Image from "next/image";
import Navbar from "@/components/common/navbar/Navbar";
import Footer from "@/components/common/footer/Footer";
import TabTitle from "@/components/common/titles/TabTitle";

import styles from "./about.module.css";

/* ================= SEO (Next.js way) ================= */
export const metadata = {
  title: "టీ టైమ్ తెలుగు - మా గురించి",
  description:
    "టీ టైమ్ తెలుగు — తాజా వార్తలు, వినోదం, సినిమా అప్‌డేట్స్ మరియు తెలుగు ప్రేక్షకుల కోసం ప్రత్యేక కంటెంట్.",
};

export default function AboutPage() {
  return (
    <>
      <div className={styles.page}>
        <TabTitle title="మా గురించి" />

        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.content}>
              {/* ===== TEXT ===== */}
              <div className={styles.text}>
                <h1 className={styles.heading}>టీ టైమ్ తెలుగు</h1>

                <p>
                  తెలుగు మాట్లాడే ప్రేక్షకుల కోసం వార్తలు మరియు వినోదాన్ని
                  ప్రత్యేకంగా అందించేందుకు ఈ వేదిక ప్రారంభమైంది. కాలక్రమేణా ఇది
                  24 గంటల తాజా అప్‌డేట్స్ అందించే నమ్మకమైన వినోద వార్తల
                  గమ్యస్థానంగా మారింది.
                </p>

                <p>
                  ఈ వేదిక పాఠకులను సమాచారంతో పాటు వినోదాన్ని కలిపి ఉంచే విభిన్న
                  కంటెంట్‌ను అందిస్తుంది. బ్రేకింగ్ న్యూస్, ట్రెండింగ్ టాపిక్స్
                  నుండి లోతైన సినిమా సమీక్షలు, అవార్డు సీజన్ ముఖ్యాంశాలు వరకు —
                  టీ టైమ్ తెలుగు ప్రతి పాఠకుడి ఆసక్తిని తీర్చుతుంది.
                </p>

                <p>
                  ప్రత్యేక సెలబ్రిటీ ఇంటర్వ్యూలు, OTT రిలీజ్ అప్‌డేట్స్,
                  రాజకీయ-సామాజిక విశ్లేషణలు, సినిమా ఈవెంట్స్ మరియు ఫోటో
                  గ్యాలరీలు కూడా అందిస్తుంది. తెలుగు భాషలో క్రమం తప్పకుండా
                  అప్‌డేట్స్ ఇస్తూ, ఇది తన ప్రేక్షకులతో మరింత దగ్గరగా అనుసంధానం
                  అవుతుంది.
                </p>

                <p>
                  రైటర్లు మరియు టెక్నికల్ నిపుణుల బృందం పాఠకులకు నచ్చేలా
                  ఆసక్తికరమైన, నాణ్యమైన కథనాలను అందించేందుకు నిరంతరం
                  శ్రమిస్తుంది.
                </p>

                <p className={styles.signature}>
                  హ్యాపీ రీడింగ్! <br />— టీ టైమ్ తెలుగు బృందం
                </p>
              </div>

              {/* ===== IMAGE ===== */}
              <div className={styles.imageWrap}>
                <Image
                  src="/images/logo.jpg"
                  alt="Tea Time Telugu Team"
                  fill
                  priority
                  className={styles.image}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
