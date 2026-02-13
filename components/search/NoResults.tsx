import styles from "./NoResults.module.css";

type Props = {
  text: string;
};

export default function NoResults({ text }: Props) {
  return (
    <p className={styles.text}>
      No results found for "<b>{text}</b>"
    </p>
  );
}
