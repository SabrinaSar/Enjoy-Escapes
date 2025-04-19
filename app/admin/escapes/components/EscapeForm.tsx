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

// Map of board basis values to display labels
const BOARD_BASIS_LABELS = {
  room_only: "Room Only",
  self_catering: "Self-Catering",
  bed_and_breakfast: "Bed & Breakfast",
  half_board: "Half Board",
  full_board: "Full Board",
  all_inclusive: "All Inclusive",
  ultra_all_inclusive: "Ultra All Inclusive (AI+)",
  flight_only: "Flight Only",
};

export function EscapeForm({ action, initialData, formType }: EscapeFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Add refs for form fields
  const titleRef = React.useRef<HTMLInputElement>(null);
  const subtitleRef = React.useRef<HTMLTextAreaElement>(null);
  const countryRef = React.useRef<HTMLInputElement>(null);
  const cityRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  const linkRef = React.useRef<HTMLInputElement>(null);
  const nightsRef = React.useRef<HTMLInputElement>(null);
  const starRatingRef = React.useRef<HTMLInputElement>(null);
  const depositPriceRef = React.useRef<HTMLInputElement>(null);

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
        validFrom: initialData.validFrom?.split("T")[0] ?? "",
        validTo: initialData.validTo?.split("T")[0] ?? "",
        nights: initialData.nights ?? "",
        board_basis: initialData.board_basis ?? "",
        star_rating: initialData.star_rating ?? "",
        price_unit: initialData.price_unit ?? "pp",
        deposit_price: initialData.deposit_price ?? "",
        deposit_price_unit: initialData.deposit_price_unit ?? "pp",
        city: initialData.city ?? "",
      }
    : {
        title: "",
        subtitle: "",
        country: "",
        city: "",
        price: "",
        price_unit: "pp",
        deposit_price: "",
        deposit_price_unit: "pp",
        link: "",
        image: "",
        type: "hotel",
        validFrom: "",
        validTo: "",
        nights: "",
        board_basis: "",
        star_rating: "",
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
              <Label htmlFor="city">City</Label>
              <Input
                ref={cityRef}
                id="city"
                name="city"
                placeholder="e.g., Marrakech"
                defaultValue={defaultValues.city}
                aria-invalid={!!state.errors?.city}
                aria-describedby="city-error"
              />
              {state.errors?.city && (
                <p
                  id="city-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.city.join(", ")}
                </p>
              )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                ref={priceRef}
                id="price"
                name="price"
                placeholder="e.g., £599"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_unit">Price Unit</Label>
              <select
                id="price_unit"
                name="price_unit"
                defaultValue={defaultValues.price_unit}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!state.errors?.price_unit}
                aria-describedby="price-unit-error"
              >
                <option value="pp">Per Person (pp)</option>
                <option value="pn">Per Night (pn)</option>
                <option value="pr">Per Room (pr)</option>
              </select>
              {state.errors?.price_unit && (
                <p
                  id="price-unit-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.price_unit.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deposit_price">Deposit Price</Label>
              <Input
                ref={depositPriceRef}
                id="deposit_price"
                name="deposit_price"
                placeholder="e.g., £75"
                defaultValue={defaultValues.deposit_price}
                aria-invalid={!!state.errors?.deposit_price}
                aria-describedby="deposit-price-error"
              />
              {state.errors?.deposit_price && (
                <p
                  id="deposit-price-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.deposit_price.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_price_unit">Deposit Price Unit</Label>
              <select
                id="deposit_price_unit"
                name="deposit_price_unit"
                defaultValue={defaultValues.deposit_price_unit}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!state.errors?.deposit_price_unit}
                aria-describedby="deposit-price-unit-error"
              >
                <option value="pp">Per Person (pp)</option>
                <option value="pn">Per Night (pn)</option>
                <option value="pr">Per Room (pr)</option>
              </select>
              {state.errors?.deposit_price_unit && (
                <p
                  id="deposit-price-unit-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.deposit_price_unit.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nights">Number of Nights</Label>
              <Input
                ref={nightsRef}
                id="nights"
                name="nights"
                type="number"
                min="1"
                placeholder="e.g., 7"
                defaultValue={defaultValues.nights}
                aria-invalid={!!state.errors?.nights}
                aria-describedby="nights-error"
              />
              {state.errors?.nights && (
                <p
                  id="nights-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.nights.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="star_rating">Star Rating</Label>
              <Input
                ref={starRatingRef}
                id="star_rating"
                name="star_rating"
                type="number"
                min="1"
                max="6"
                placeholder="e.g., 5"
                defaultValue={defaultValues.star_rating}
                aria-invalid={!!state.errors?.star_rating}
                aria-describedby="star-rating-error"
              />
              {state.errors?.star_rating && (
                <p
                  id="star-rating-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.star_rating.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="board_basis">Board Basis</Label>
              <select
                id="board_basis"
                name="board_basis"
                defaultValue={defaultValues.board_basis}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!state.errors?.board_basis}
                aria-describedby="board-basis-error"
              >
                <option value="">Select Board Basis</option>
                <option value="room_only">
                  {BOARD_BASIS_LABELS.room_only}
                </option>
                <option value="self_catering">
                  {BOARD_BASIS_LABELS.self_catering}
                </option>
                <option value="bed_and_breakfast">
                  {BOARD_BASIS_LABELS.bed_and_breakfast}
                </option>
                <option value="half_board">
                  {BOARD_BASIS_LABELS.half_board}
                </option>
                <option value="full_board">
                  {BOARD_BASIS_LABELS.full_board}
                </option>
                <option value="all_inclusive">
                  {BOARD_BASIS_LABELS.all_inclusive}
                </option>
                <option value="ultra_all_inclusive">
                  {BOARD_BASIS_LABELS.ultra_all_inclusive}
                </option>
                <option value="flight_only">
                  {BOARD_BASIS_LABELS.flight_only}
                </option>
              </select>
              {state.errors?.board_basis && (
                <p
                  id="board-basis-error"
                  className="text-sm font-medium text-destructive"
                >
                  {state.errors.board_basis.join(", ")}
                </p>
              )}
            </div>
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
