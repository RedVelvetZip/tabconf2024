export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center w-full text-center mt-8">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="list-inside list-decimal text-xl font-[family-name:var(--font-geist-mono)]">
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            D
          </code>
          iscreet{" "}
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            L
          </code>
          u
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            c
          </code>
          k
        </h2>
      </div>
    </header>
  );
}
