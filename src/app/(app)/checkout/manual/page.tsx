import { Suspense } from "react";
import ManualCheckoutContent from "./ManualCheckoutContent";

export default function ManualCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <ManualCheckoutContent />
    </Suspense>
  );
}