import { EscapeForm } from "../components/EscapeForm";
import { Toaster } from "@/components/ui/sonner"; // Add Toaster for notifications
import { createEscape } from "../actions";

export default function CreateEscapePage() {
  return (
    <>
      <EscapeForm onSubmit={createEscape} formType="create" />
      <Toaster richColors /> {/* Ensure Toaster is rendered */}
    </>
  );
}
