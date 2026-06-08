import { Suspense } from "react";
import UploadProofContent from "./UploadProofContent";

export default function UploadProofPage() {
  return (
    <Suspense fallback={<div>Loading upload page...</div>}>
      <UploadProofContent />
    </Suspense>
  );
}