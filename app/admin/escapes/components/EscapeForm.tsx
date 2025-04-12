"use client";

import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Using sonner for toast notifications
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type EscapeData = Database["public"]["Tables"]["escapes_data"]["Row"];
type EscapeInsert = Database["public"]["Tables"]["escapes_data"]["Insert"];
type EscapeUpdate = Database["public"]["Tables"]["escapes_data"]["Update"];

// Basic Zod schema (can be expanded with more specific rules)
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  subtitle: z
    .string()
    .min(5, { message: "Subtitle must be at least 5 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  link: z.string().url({ message: "Please enter a valid URL." }),
  image: z.string().url({ message: "Please enter a valid image URL." }),
  tags: z.string().optional(), // Handle comma-separated string for tags input
  validFrom: z.string().optional(), // Consider using a date picker
  validTo: z.string().optional(), // Consider using a date picker
});

interface EscapeFormProps {
  onSubmit: (
    values: EscapeInsert | EscapeUpdate
  ) => Promise<{ success: boolean; message: string; data?: any; error?: any }>;
  initialData?: EscapeData | null; // Optional initial data for editing
  formType: "create" | "edit";
}

export function EscapeForm({
  onSubmit,
  initialData,
  formType,
}: EscapeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = initialData
    ? {
        ...initialData,
        tags: initialData.tags?.join(", ") || "", // Convert array to comma-separated string for input
        validFrom: initialData.validFrom?.split("T")[0] || "", // Format date for input type=date
        validTo: initialData.validTo?.split("T")[0] || "",
      }
    : {
        title: "",
        subtitle: "",
        country: "",
        price: "",
        link: "",
        image: "",
        tags: "",
        validFrom: "",
        validTo: "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const tagsArray =
      values.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag) || null;

    // Prepare data for submission (either Insert or Update type)
    const submissionData: EscapeInsert | EscapeUpdate = {
      ...values,
      tags: tagsArray,
      // Ensure dates are in ISO format or null if empty
      validFrom: values.validFrom
        ? new Date(values.validFrom).toISOString()
        : null,
      validTo: values.validTo ? new Date(values.validTo).toISOString() : null,
    };

    // If editing, add the ID
    if (formType === "edit" && initialData?.id) {
      (submissionData as EscapeUpdate).id = initialData.id;
    }

    try {
      const result = await onSubmit(submissionData);
      if (result.success) {
        toast.success(
          result.message ||
            (formType === "create"
              ? "Escape created successfully!"
              : "Escape updated successfully!")
        );
        // Redirect after successful submission
        router.push("/admin/escapes");
        router.refresh(); // Ensure data is refreshed on the target page
      } else {
        toast.error(result.message || "An error occurred.");
        console.error("Submission error:", result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {formType === "create" ? "Create New Escape" : "Edit Escape"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Luxury Beach Resort" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description of the escape..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Maldives" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $1999 / 7 nights" {...field} />
                    </FormControl>
                    <FormDescription>
                      Include currency and duration if applicable.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/booking"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., beach, luxury, all-inclusive"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of tags.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid From (Optional)</FormLabel>
                    <FormControl>
                      {/* Use type="date" for a basic date picker */}
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid To (Optional)</FormLabel>
                    <FormControl>
                      {/* Use type="date" for a basic date picker */}
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : formType === "create"
                  ? "Create Escape"
                  : "Update Escape"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
