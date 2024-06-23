"use client";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AlgoliaSearch from "@/components/algolia-search";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react";
import { useKeyPress } from "@/lib/hooks";

export default function AlgoliaDialog() {
  const [open, setOpen] = useState(false);
  useKeyPress(() => setOpen && setOpen(true), "KeyK");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaMagnifyingGlass />
          <span
            className="hidden md:inline-block badge variant-soft"
            data-svelte-h="svelte-1r4nm96"
          >
            ⌘+K
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-lg p-0 sm:px-6 ">
        <AlgoliaSearch showFacets={false} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
