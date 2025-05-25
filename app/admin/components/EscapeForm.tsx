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
import { CalendarIcon } from "lucide-react";

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
  ultra_all_inclusive: "Ultra All Inclusive",
  flight_only: "Flight Only",
};

export function EscapeForm({ action, initialData, formType }: EscapeFormProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Add refs for form fields
  const titleRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);
  const linkRef = React.useRef<HTMLInputElement>(null);
  const nightsRef = React.useRef<HTMLInputElement>(null);
  const starRatingRef = React.useRef<HTMLInputElement>(null);
  const depositPriceRef = React.useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 4;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // Create form state to persist values between renders
  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    price: initialData?.price || "",
    price_unit: initialData?.price_unit || "pp",
    deposit_price: initialData?.deposit_price || "",
    deposit_price_unit: initialData?.deposit_price_unit || "pp",
    link: initialData?.link || "",
    type: (initialData?.type as "hotel" | "flight" | "hotel+flight") || "hotel",
    nights: initialData?.nights || "",
    board_basis: initialData?.board_basis || "",
    star_rating: initialData?.star_rating || "",
    school_holidays: initialData?.school_holidays || false,
    long_haul: initialData?.long_haul || false,
    featured: initialData?.featured || false,
    hot_deal: initialData?.hot_deal || false,
    last_minute: initialData?.last_minute || false,
    scheduled_for: initialData?.scheduled_for || "",
  });

  // Handle input changes to update state
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const initialState: FormState = {
    success: false,
    message: "",
    errors: {},
  };

  const [state, formAction] = useActionState(action, initialState);

  const [selectedType, setSelectedType] = React.useState<string>(
    initialData?.type ?? "hotel"
  );

  // Filter board_basis options based on selectedType
  const getFilteredBoardBasisOptions = () => {
    if (selectedType === "flight") {
      return ["flight_only"];
    }
    if (selectedType === "hotel") {
      return Object.keys(BOARD_BASIS_LABELS).filter((k) => k !== "flight_only");
    }
    if (selectedType === "hotel+flight") {
      return Object.keys(BOARD_BASIS_LABELS).filter(
        (k) => k !== "flight_only" && k !== "room_only"
      );
    }
    return Object.keys(BOARD_BASIS_LABELS);
  };

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        router.push("/admin");
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

  // Synchronize type selection with formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: selectedType as "hotel" | "flight" | "hotel+flight",
    }));
  }, [selectedType]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Check if file has a valid name
    if (!file.name || file.name.trim() === "") {
      toast.error("File must have a valid name.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Check for HEIC files (by file extension and MIME type)
    const fileName = file.name.toLowerCase();
    const isHeicByExtension = fileName.endsWith('.heic') || fileName.endsWith('.heif');
    const isHeicByMimeType = file.type === 'image/heic' || file.type === 'image/heif';
    
    if (isHeicByExtension || isHeicByMimeType) {
      toast.error("HEIC/HEIF files are not supported. Please convert to JPG, PNG, or WebP format.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Verify it's a valid image file
    if (!file.type.startsWith("image/")) {
      toast.error("File must be a valid image.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
  };

  // Add this helper function to convert between timezones properly
  const formatDateForInput = (isoString: string | null | undefined) => {
    if (!isoString) return '';
    // This ensures the date is interpreted in the local timezone
    const date = new Date(isoString);
    // Format as YYYY-MM-DDThh:mm (required format for datetime-local input)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // Add this function to convert from local time to UTC when saving
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localDateTimeValue = e.target.value;
    
    if (!localDateTimeValue) {
      // If the input is cleared, set scheduled_for to empty string
      setFormData((prev) => ({
        ...prev,
        scheduled_for: "",
      }));
      return;
    }
    
    // Create a date object from the local datetime input
    // This will be interpreted as local time
    const localDate = new Date(localDateTimeValue);
    
    // Convert to ISO string (which is in UTC)
    const isoString = localDate.toISOString();
    
    // Update the form data with the ISO string
    setFormData((prev) => ({
      ...prev,
      scheduled_for: isoString,
    }));
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
              value={formData.title}
              onChange={handleInputChange}
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
            <Label htmlFor="type">Deal Type</Label>
            <div className="relative">
              <select
                id="type"
                name="type"
                value={selectedType}
                aria-invalid={!!state.errors?.type}
                aria-describedby="type-error"
                className="w-full appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleInputChange(e);
                }}
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
              value={formData.link}
              onChange={handleInputChange}
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
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              aria-invalid={!!state.errors?.image_file}
              aria-describedby="image-file-error"
              className="text-foreground file:mr-2 file:px-2 file:py-1 file:bg-secondary file:text-secondary-foreground file:border-0 file:rounded"
            />
            <p className="text-sm text-muted-foreground">
              {formType === "edit"
                ? "Upload a new image to replace the current one."
                : "Upload an image for the escape."} Supported formats: JPG, PNG, WebP, GIF. HEIC files are not supported.
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
              <Label htmlFor="price">Price (£)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  £
                </span>
                <Input
                  ref={priceRef}
                  id="price"
                  name="price"
                  placeholder="e.g., 599"
                  value={
                    typeof formData.price === "string" &&
                    formData.price.startsWith("£")
                      ? formData.price.substring(1)
                      : formData.price
                  }
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }));
                  }}
                  className="pl-7"
                  aria-invalid={!!state.errors?.price}
                  aria-describedby="price-error"
                />
              </div>
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
                value={formData.price_unit}
                onChange={handleInputChange}
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
              <Label htmlFor="deposit_price">Deposit Price (£)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  £
                </span>
                <Input
                  ref={depositPriceRef}
                  id="deposit_price"
                  name="deposit_price"
                  placeholder="e.g., 75"
                  value={formData.deposit_price}
                  onChange={handleInputChange}
                  className="pl-7"
                  aria-invalid={!!state.errors?.deposit_price}
                  aria-describedby="deposit-price-error"
                />
              </div>
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
                value={formData.deposit_price_unit}
                onChange={handleInputChange}
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
                value={formData.nights}
                onChange={handleInputChange}
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
                value={formData.star_rating}
                onChange={handleInputChange}
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
                value={formData.board_basis}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!state.errors?.board_basis}
                aria-describedby="board-basis-error"
              >
                <option value="">Select Board Basis</option>
                {getFilteredBoardBasisOptions().map((key) => (
                  <option key={key} value={key}>
                    {BOARD_BASIS_LABELS[key as keyof typeof BOARD_BASIS_LABELS]}
                  </option>
                ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="school_holidays"
                  name="school_holidays"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.school_holidays}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      school_holidays: e.target.checked,
                    }))
                  }
                  value="true"
                />
                <Label htmlFor="school_holidays">School Holidays</Label>
              </div>
              <p className="text-xs text-gray-500">
                Check if this escape is available during school holidays
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="long_haul"
                  name="long_haul"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.long_haul}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      long_haul: e.target.checked,
                    }))
                  }
                  value="true"
                />
                <Label htmlFor="long_haul">Long Haul</Label>
              </div>
              <p className="text-xs text-gray-500">
                Check if this is a long-haul destination
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  value="true"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <p className="text-xs text-gray-500">
                Check to make this a featured escape (special blue styling)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hot_deal"
                  name="hot_deal"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.hot_deal}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hot_deal: e.target.checked,
                    }))
                  }
                  value="true"
                />
                <Label htmlFor="hot_deal">Hot Deal</Label>
              </div>
              <p className="text-xs text-gray-500">
                Check to mark this as a hot deal (special styling)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="last_minute"
                  name="last_minute"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formData.last_minute}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_minute: e.target.checked,
                    }))
                  }
                  value="true"
                />
                <Label htmlFor="last_minute">Last Minute</Label>
              </div>
              <p className="text-xs text-gray-500">
                Check to mark this as a last minute deal
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="scheduled_for">Schedule Publication Date/Time</Label>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                type="datetime-local"
                id="scheduled_for"
                name="scheduled_for"
                value={formData.scheduled_for ? 
                  formatDateForInput(formData.scheduled_for) : 
                  ""}
                onChange={handleDateTimeChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">
              Leave empty to publish immediately, or set a future date/time for when this deal should appear on the website.
            </p>
            {state.errors?.scheduled_for && (
              <p
                id="scheduled-for-error"
                className="text-sm font-medium text-destructive"
              >
                {state.errors.scheduled_for.join(", ")}
              </p>
            )}
          </div>

          <SubmitButton formType={formType} />
        </form>
      </CardContent>
    </Card>
  );
}
