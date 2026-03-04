"use client";

import { useEffect, useState } from "react";
import { Mail, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
type PopupData = {
  title: string;
  description: string;
  image_url?: string | null;
};

const fallbackPopup: PopupData = {
  title: "Don't miss our\nexclusive deals!",
  description:
    "Subscribe to our travel newsletter and get the best offers and destination guides right to your inbox.",
  image_url: null,
};

export function MailPopup() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setImageLoading(true);
      return;
    }

    const fetchPopup = async () => {
      const { data, error } = await supabase
        .from("newsletter_popup_settings")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!error && data) {
        setPopupData({
          title: data.title ?? fallbackPopup.title,
          description: data.description ?? fallbackPopup.description,
          image_url: data.image_url ?? null,
        });

        // If there's no image URL, loading is done immediately
        if (!data.image_url) {
          setImageLoading(false);
        }
      } else {
        // Fallback case: check if fallback has an image
        if (!fallbackPopup.image_url) {
          setImageLoading(false);
        }
      }
    };

    fetchPopup();
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // Capture the form element
    const form = e.currentTarget;

    try {
      // Still save to Supabase for internal records
      await supabase.from("newsletter_subscribers").insert([{ email }]);

      toast.success("Subscribed successfully!");
      setIsSubmitted(true);

      // Give a small delay to show the success message before redirecting to Mailchimp if needed
      // However, usually we want to let Mailchimp handle the redirection if the user wants "like this"
      // If we want to stay on the page, we'd use a different approach, but this matches the user request.

      // To allow the standard form submission to Mailchimp after our async work:
      form.submit();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }

    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  const content = popupData ?? fallbackPopup;
  console.log(content);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group hover:bg-primary/10 transition-colors"
        >
          <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </Button>
      </DialogTrigger>
      {/* Updated styling to use brand theme background color and borders */}
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-border rounded-lg shadow-2xl bg-background animate-in fade-in zoom-in duration-300">
        <div className=" space-y-6 flex flex-col items-center">
          {/* Illustration Container */}
          <div className="relative w-full h-48 flex items-center justify-center bg-muted/30">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {content.image_url ? (
              <img
                src={content.image_url}
                alt="Newsletter"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 p-4 text-center">
                <Mail className="h-12 w-12 text-primary/20 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Premium Travel Updates
                </p>
              </div>
            )}
          </div>
          <div className="sm:p-6 p-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight whitespace-pre-line">
                {content.title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-medium   mt-2 ">
                {content.description}
              </p>
            </div>

            {!isSubmitted ? (
              <div className="w-full mt-4">
                <form
                  action="https://enjoyescapes.us18.list-manage.com/subscribe/post"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="w-full space-y-4"
                >
                  <input
                    type="hidden"
                    name="u"
                    value="04a882be1679191e819450535"
                  />
                  <input type="hidden" name="id" value="5c84056061" />
                  <div className="relative">
                    <Input
                      type="email"
                      name="MERGE0"
                      id="MERGE0"
                      placeholder="Enter your email"
                      className="w-full h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoCapitalize="off"
                      autoCorrect="off"
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-destructive text-xs text-center">
                      {errorMessage}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold transition-colors rounded-md shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Keep me posted"
                    )}
                  </Button>
                </form>
                <div className="relative mt-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      No spam ever
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center  space-y-3 animate-in fade-in slide-in-from-bottom-4 w-full mt-4">
                <p className="text-blue-500 text-center font-medium max-w-[280px]">
                  You have successfully subscribed to our travel newsletter.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
