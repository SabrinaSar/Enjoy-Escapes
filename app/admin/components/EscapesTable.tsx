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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { deleteEscape } from "../actions"; // Import the delete action
import { toast } from "sonner";
import { useState } from "react";

type Escape = Database["public"]["Tables"]["escapes_data"]["Row"];

interface EscapesTableProps {
  escapes: Escape[];
}

export default function EscapesTable({ escapes }: EscapesTableProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

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

  return (
    <AlertDialog
      open={deleteTargetId !== null}
      onOpenChange={(open) => !open && setDeleteTargetId(null)}
    >
      <Table>
        <TableCaption>A list of your recent escapes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escapes.map((escape) => (
            <TableRow key={escape.id}>
              <TableCell className="font-medium">{escape.id}</TableCell>
              <TableCell>{escape.title}</TableCell>
              <TableCell>{escape.country}</TableCell>
              <TableCell>£{escape.price}</TableCell>
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
