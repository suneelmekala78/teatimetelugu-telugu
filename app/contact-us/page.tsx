import ContactClient from "./ContactClient";

/* ✅ metadata MUST stay in server file */
export const metadata = {
  title: "టీ టైమ్ తెలుగు - మమ్మల్ని సంప్రదించండి",
  description:
    "టీ టైమ్ తెలుగు బృందాన్ని సంప్రదించండి. మీ అభిప్రాయాలు మరియు సూచనలు మాకు ఎంతో విలువైనవి.",
};

export default function Page() {
  return <ContactClient />;
}
