"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Flame,
  Hotel,
  Moon,
  MoreHorizontal,
  PackageCheck,
  Plane,
  PlaneTakeoff,
  School,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { deleteEscape } from "../actions"; // Import the delete action
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type Escape = Database["public"]["Tables"]["escapes_data"]["Row"];

interface EscapesTableProps {
  escapes: Escape[];
}

// Board Basis labels
const BOARD_BASIS_LABELS: Record<string, string> = {
  room_only: "Room Only",
  self_catering: "Self-Catering",
  bed_and_breakfast: "Bed & Breakfast",
  half_board: "Half Board",
  full_board: "Full Board",
  all_inclusive: "All Inclusive",
  ultra_all_inclusive: "Ultra All Inclusive",
  flight_only: "Flight Only",
};

// Format price with unit
const formatPrice = (price?: number | null, unit?: string | null) => {
  if (price === null || price === undefined) return null;

  const unitDisplay = unit ? ` ${unit}` : "";
  return `£${price}${unitDisplay}`;
};

// Feature Badges component to handle special attributes
const FeatureBadges = ({ escape }: { escape: Escape }) => {
  // Helper function to check if a boolean value from Supabase is true
  // This handles various ways booleans can be represented in responses
  const isTrue = (value: any): boolean => {
    // Check explicitly for all possible true representations
    if (value === true) return true;
    if (value === "true") return true;
    if (value === 1) return true;
    if (value === "1") return true;

    // Otherwise, assume it's not true
    return false;
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {isTrue(escape.featured) && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
        >
          <Sparkles className="h-3 w-3" />
          <span className="text-xs">Featured</span>
        </Badge>
      )}

      {isTrue(escape.hot_deal) && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
        >
          <Flame className="h-3 w-3" />
          <span className="text-xs">Hot Deal</span>
        </Badge>
      )}

      {isTrue(escape.school_holidays) && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <School className="h-3 w-3" />
          <span className="text-xs">School Hols</span>
        </Badge>
      )}

      {isTrue(escape.long_haul) && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <PlaneTakeoff className="h-3 w-3" />
          <span className="text-xs">Long Haul</span>
        </Badge>
      )}
    </div>
  );
};

export default function EscapesTable({ escapes }: EscapesTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    // The AlertDialogTrigger bound to the state will open the dialog
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;

    setIsDeleting(true);
    try {
      const result = await deleteEscape(deleteTargetId);
      if (result.success) {
        toast.success(result.message || "Escape deleted successfully!");
        // Revalidation happens in the server action, so the table should update automatically
        // after navigation or refresh. We could potentially remove the item client-side too.
      } else {
        toast.error(result.message || "Failed to delete escape.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An unexpected error occurred during deletion.");
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null); // Close the dialog by resetting the ID
    }
  };

  // Deal Type Badge component
  const DealTypeBadge = ({
    type,
  }: {
    type: "hotel" | "flight" | "hotel+flight" | null;
  }) => {
    if (!type) return null;

    let icon = null;
    let label = "";
    let variant = "default";

    if (type === "hotel") {
      icon = <Hotel className="h-3 w-3 mr-1" />;
      label = "Hotel";
      variant = "outline";
    } else if (type === "flight") {
      icon = <Plane className="h-3 w-3 mr-1" />;
      label = "Flight";
      variant = "secondary";
    } else if (type === "hotel+flight") {
      icon = <PackageCheck className="h-3 w-3 mr-1" />;
      label = "Package";
      variant = "default";
    }

    return (
      <Badge variant={variant as any} className="flex items-center">
        {icon}
        {label}
      </Badge>
    );
  };

  // Star Rating component
  const StarRating = ({ rating }: { rating: number | null }) => {
    if (!rating) return null;

    return (
      <div className="flex items-center">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        ))}
      </div>
    );
  };

  // If there are no results, show a message
  if (escapes.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No escapes found</h3>
        <p className="text-muted-foreground mt-1">
          {searchQuery
            ? `No results match "${searchQuery}". Try a different search term.`
            : "There are no escapes yet. Create your first one!"}
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/create">Create New Escape</Link>
        </Button>
      </div>
    );
  }

  return (
    <AlertDialog
      open={deleteTargetId !== null}
      onOpenChange={(open) => !open && setDeleteTargetId(null)}
    >
      <Table>
        <TableCaption>
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "A list of your recent escapes."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Image</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escapes.map((escape) => (
            <TableRow key={escape.id}>
              <TableCell>
                {escape.image && (
                  <div className="relative h-10 w-14 overflow-hidden rounded">
                    <Image
                      src={escape.image}
                      alt={escape.title || "Escape image"}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{escape.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {escape.country}
                    {escape.city ? `, ${escape.city}` : ""}
                  </span>
                  <StarRating rating={escape.star_rating} />
                  <FeatureBadges escape={escape} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <DealTypeBadge type={escape.type} />

                  {escape.board_basis && (
                    <span className="text-xs text-muted-foreground">
                      {BOARD_BASIS_LABELS[escape.board_basis] ||
                        escape.board_basis}
                    </span>
                  )}

                  {escape.nights && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Moon className="h-3 w-3" />
                      <span>
                        {escape.nights}{" "}
                        {escape.nights === 1 ? "night" : "nights"}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {formatPrice(escape.price, escape.price_unit)}
                  </span>

                  {escape.deposit_price && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      £{escape.deposit_price} deposit
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {escape.validTo && (
                    <span>
                      Until: {new Date(escape.validTo).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/${escape.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={escape.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Deal
                      </Link>
                    </DropdownMenuItem>
                    {/* Use AlertDialogTrigger within the item to control the dialog */}
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                        onSelect={(e) => e.preventDefault()} // Prevent menu close on select
                        onClick={() => handleDeleteClick(escape.id)} // Set the ID to delete
                      >
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            escape record from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setDeleteTargetId(null)}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Yes, delete escape"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
