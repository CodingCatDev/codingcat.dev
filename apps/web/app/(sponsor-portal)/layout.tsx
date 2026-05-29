export default function SponsorPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">CodingCat.dev — Sponsor Portal</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        {children}
      </main>
      <footer className="flex h-14 items-center justify-center border-t text-sm text-muted-foreground">
        © CodingCat.dev
      </footer>
    </div>
  )
}
