export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center px-4 py-8">
      <main className="w-full max-w-4xl">{children}</main>
    </div>
  );
}
