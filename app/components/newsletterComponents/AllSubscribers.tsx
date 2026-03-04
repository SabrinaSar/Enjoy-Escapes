import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteSubscriberButton } from "./DeleteSubscriberButton";
import { Mail, Calendar } from "lucide-react";
import { RefreshButton } from "./RefreshButton";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 10;

const AllSubscribers = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const currentPage = Number(searchParams?.page ?? "1");
  const page = currentPage > 0 ? currentPage : 1;

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // ✅ Fetch paginated data
  const {
    data: subscribers,
    count,
    error,
  } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.log("FETCH ERROR:", error);
  }

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Subscriber List
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your newsletter subscribers.
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers && subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {subscriber.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(subscriber.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatTime(subscriber.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteSubscriberButton id={subscriber.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {/* Previous Button */}
          {page > 1 && (
            <Link
              href={`/admin/newsletter?page=${page - 1}`}
              className="px-4 py-2 text-sm rounded-md border text-foreground hover:bg-muted transition"
            >
              Previous
            </Link>
          )}

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;

            return (
              <Link
                key={pageNumber}
                href={`/admin/newsletter?page=${pageNumber}`}
                className={`px-4 py-2 text-sm rounded-md border transition ${
                  page === pageNumber
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}

          {/* Next Button */}
          {page < totalPages && (
            <Link
              href={`/admin/newsletter?page=${page + 1}`}
              className="px-4 py-2 text-sm rounded-md border text-foreground hover:bg-muted transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AllSubscribers;
