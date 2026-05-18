export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-2xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Adi Wisnu</span>
        <span className="tracking-tight">adiwisnu.com</span>
      </div>
    </footer>
  );
}
