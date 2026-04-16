import { useState } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { tags, performers } from "@/data/mockData";
import { useUserPrefs } from "@/context/UserPrefsContext";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Use DialogPrimitive.Content directly so we can omit the built-in close button.
// Dismissing via the X icon or Escape is handled by the parent onOpenChange → skipOnboarding.
const ModalContent = DialogPrimitive.Content;

// Tags worth showing at onboarding — Genre and Format are meaningful for seeding
const onboardingTags = tags.filter(
  (t) => t.category === "Genre" || t.category === "Format"
);

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border",
        selected
          ? "bg-primary/15 text-primary border-primary/40"
          : "bg-secondary/50 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export default function OnboardingModal() {
  const { prefs, completeOnboarding, skipOnboarding } = useUserPrefs();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedPerformerIds, setSelectedPerformerIds] = useState<string[]>([]);

  const isOpen = !prefs.hasOnboarded;

  const toggle = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    item: T
  ) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleComplete = () => {
    completeOnboarding(selectedTagIds, selectedPerformerIds);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // X button or Escape → treat as skip
        if (!open) skipOnboarding();
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        <ModalContent
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]",
            "rounded-lg border bg-background p-6 shadow-lg",
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
          // Prevent accidental dismiss — user must click Skip or Get Started
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <h2 className="text-base font-semibold text-foreground leading-none">
              Personalise your feed
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Pick a few interests so we can surface content you'll enjoy.
          </p>

          <div className="space-y-5">
            {/* Genre / Format interests */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-2">
                Genres &amp; Formats
              </p>
              <div className="flex flex-wrap gap-1.5">
                {onboardingTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    selected={selectedTagIds.includes(tag.id)}
                    onClick={() => toggle(selectedTagIds, setSelectedTagIds, tag.id)}
                  />
                ))}
              </div>
            </div>

            {/* Performer interests */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold mb-2">
                Performers
              </p>
              <div className="flex flex-wrap gap-1.5">
                {performers.map((p) => (
                  <Chip
                    key={p.id}
                    label={p.name}
                    selected={selectedPerformerIds.includes(p.id)}
                    onClick={() =>
                      toggle(selectedPerformerIds, setSelectedPerformerIds, p.id)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={skipOnboarding}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Skip for now
            </button>
            <Button size="sm" onClick={handleComplete} className="h-7 text-xs px-4">
              Get Started
            </Button>
          </div>
        </ModalContent>
      </DialogPortal>
    </Dialog>
  );
}
