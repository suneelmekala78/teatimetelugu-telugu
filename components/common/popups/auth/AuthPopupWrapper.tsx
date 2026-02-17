import { Suspense } from "react";
import AuthPopup from "./AuthPopup";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthPopupWrapper(props: Props) {
  return (
    <Suspense fallback={null}>
      <AuthPopup {...props} />
    </Suspense>
  );
}
