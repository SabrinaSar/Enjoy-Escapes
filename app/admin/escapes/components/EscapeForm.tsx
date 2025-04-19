"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Database } from "@/types/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useActionState } from "react";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

type EscapeData = Database["public"]["Tables"]["escapes_data"]["Row"];

interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}

type ServerAction = (
  prevState: FormState,
  formData: FormData
) => Promise<FormState>;

interface EscapeFormProps {
  action: ServerAction;
  initialData?: EscapeData | null;
  formType: "create" | "edit";
}

function SubmitButton({ formType }: { formType: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="px-2 py-1 bg-secondary text-secondary-foreground border-0 rounded"
    >
      {pending
        ? formType === "create"
          ? "Creating..."
          : "Updating..."
        : formType === "create"
          ? "Create Escape"
          : "Update Escape"}
    </Button>
  );
}

export function EscapeForm({ action, initialData, formType }: EscapeFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Add refs for form fields
  const titleRef = React.useRef<HTMLInputElement>(null);
  const subtitleRef = React.useRef<HTMLTextAreaElement>(null);
  const countryRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  const linkRef = React.useRef<HTMLInputElement>(null);
  const tagsRef = React.useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 3;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // Add test data functions
  const fillTestData1 = () => {
    if (titleRef.current) titleRef.current.value = "Morocco 🌴 All inclusive";
    if (subtitleRef.current)
      subtitleRef.current.value =
        "All inclusive hotel stay with return flights";
    if (countryRef.current) countryRef.current.value = "Morocco";
    if (priceRef.current) priceRef.current.value = "£339";
    if (linkRef.current) linkRef.current.value = "https://prf.hn/l/xEeBPeN/";
    if (tagsRef.current)
      tagsRef.current.value = "beach, all-inclusive, flights";

    // Find the type select element and set its value to 'hotel+flight'
    const typeSelect = document.getElementById("type") as HTMLSelectElement;
    if (typeSelect) typeSelect.value = "hotel+flight";
  };

  const fillTestData2 = () => {
    if (titleRef.current) titleRef.current.value = "5* Platinum Cape Verde";
    if (subtitleRef.current)
      subtitleRef.current.value =
        "Everything included! Get yourself beach side!";
    if (countryRef.current) countryRef.current.value = "Cape Verde";
    if (priceRef.current) priceRef.current.value = "£705";
    if (linkRef.current)
      linkRef.current.value = "https://tui-uk.7cnq.net/gOqEoO";
    if (tagsRef.current)
      tagsRef.current.value = "beach, all-inclusive, flights";

    // Find the type select element and set its value to 'hotel'
    const typeSelect = document.getElementById("type") as HTMLSelectElement;
    if (typeSelect) typeSelect.value = "hotel";
  };

  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        router.push("/admin/escapes");
        router.refresh();
      } else {
        let errorMessage = state.message;
        if (state.errors && Object.keys(state.errors).length > 0) {
          errorMessage +=
            "\n" +
            Object.entries(state.errors)
              .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
              .join("\n");
        }
        toast.error(errorMessage || "An error occurred.");
        if (state.errors?.image_file && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }, [state, router]);

  const defaultValues = initialData
    ? {
        ...initialData,
        tags: initialData.tags?.join(", ") ?? "",
        validFrom: initialData.validFrom?.split("T")[0] ?? "",
        validTo: initialData.validTo?.split("T")[0] ?? "",
      }
    : {
        title: "",
        subtitle: "",
        country: "",
        price: "",
        link: "",
        image: "",
        tags: "",
        type: "hotel",
        validFrom: "",
        validTo: "",
      };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {formType === "create" ? "Create New Escape" : "Edit Escape"}
        </CardTitle>
        {!state.success && state.message && !state.errors && (
          <p className="text-sm font-medium text-destructive">
            {state.message}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {formType === "edit" && initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              ref={titleRef}
              id="title"
              name="title"
              placeholder="e.g., Luxury Beach Resort"
              defaultValue={defaultValues.title}
              aria-invalid={!!state.errors?.title}
              aria-describedby="title-error"
            />
            {state.errors?.title && (
              <p
                id="title-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.title.join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              ref={subtitleRef}
              id="subtitle"
              name="subtitle"
              placeholder="Short description of the escape..."
              defaultValue={defaultValues.subtitle}
              aria-invalid={!!state.errors?.subtitle}
              aria-describedby="subtitle-error"
            />
            {state.errors?.subtitle && (
              <p
                id="subtitle-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.subtitle.join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                ref={countryRef}
                id="country"
                name="country"
                placeholder="e.g., Maldives"
                defaultValue={defaultValues.country}
                aria-invalid={!!state.errors?.country}
                aria-describedby="country-error"
              />
              {state.errors?.country && (
                <p
                  id="country-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.country.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                ref={priceRef}
                id="price"
                name="price"
                placeholder="e.g., $1999 / 7 nights"
                defaultValue={defaultValues.price}
                aria-invalid={!!state.errors?.price}
                aria-describedby="price-error"
              />
              {state.errors?.price && (
                <p
                  id="price-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.price.join(", ")}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Include currency and duration if applicable.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Deal Type</Label>
            <div className="relative">
              <select
                id="type"
                name="type"
                defaultValue={defaultValues.type}
                aria-invalid={!!state.errors?.type}
                aria-describedby="type-error"
                className="w-full appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="hotel">Hotel</option>
                <option value="flight">Flight</option>
                <option value="hotel+flight">Hotel + Flight</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {state.errors?.type && (
              <p
                id="type-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.type.join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Booking Link</Label>
            <Input
              ref={linkRef}
              id="link"
              name="link"
              type="url"
              placeholder="https://example.com/booking"
              defaultValue={defaultValues.link}
              aria-invalid={!!state.errors?.link}
              aria-describedby="link-error"
            />
            {state.errors?.link && (
              <p
                id="link-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.link.join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_file">Image (Max {MAX_FILE_SIZE_MB}MB)</Label>
            {formType === "edit" && initialData?.image && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground">Current Image:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={initialData.image}
                  alt="Current escape image"
                  className="h-20 w-auto rounded object-cover"
                />
              </div>
            )}
            <Input
              ref={fileInputRef}
              id="image_file"
              name="image_file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              aria-invalid={!!state.errors?.image_file}
              aria-describedby="image-file-error"
              className="text-foreground file:mr-2 file:px-2 file:py-1 file:bg-secondary file:text-secondary-foreground file:border-0 file:rounded"
            />
            <p className="text-sm text-muted-foreground">
              {formType === "edit"
                ? "Upload a new image to replace the current one."
                : "Upload an image for the escape."}
            </p>
            {state.errors?.image_file && (
              <p
                id="image-file-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.image_file.join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              ref={tagsRef}
              id="tags"
              name="tags"
              placeholder="e.g., beach, luxury, all-inclusive"
              defaultValue={defaultValues.tags}
              aria-invalid={!!state.errors?.tags}
              aria-describedby="tags-error"
            />
            {state.errors?.tags && (
              <p
                id="tags-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.tags.join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From (Optional)</Label>
              <Input
                id="validFrom"
                name="validFrom"
                type="date"
                defaultValue={defaultValues.validFrom}
                aria-invalid={!!state.errors?.validFrom}
                aria-describedby="validFrom-error"
              />
              {state.errors?.validFrom && (
                <p
                  id="validFrom-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.validFrom.join(", ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="validTo">Valid To (Optional)</Label>
              <Input
                id="validTo"
                name="validTo"
                type="date"
                defaultValue={defaultValues.validTo}
                aria-invalid={!!state.errors?.validTo}
                aria-describedby="validTo-error"
              />
              {state.errors?.validTo && (
                <p
                  id="validTo-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.validTo.join(", ")}
                </p>
              )}
            </div>
          </div>

          <SubmitButton formType={formType} />

          {process.env.NODE_ENV !== "production" && (
            <div className="flex space-x-2 mt-4 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={fillTestData1}
                className="px-2 py-1 bg-secondary text-secondary-foreground border-0 rounded"
              >
                Debug: Morocco All-inclusive
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={fillTestData2}
                className="px-2 py-1 bg-secondary text-secondary-foreground border-0 rounded"
              >
                Debug: 5* Platinum Cape Verde
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
