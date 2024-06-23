/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import Bookmarks from "./bookmarks";

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-auto flex flex-col">
      <h1>Bookmarks</h1>

      <div className="grid grid-cols-1 gap-4 p-4 md:gap-8 md:p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Bookmarks />
        </Suspense>
      </div>
    </main>
  );
}
