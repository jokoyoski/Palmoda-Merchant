export default function Loading() {
  return (
    <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-xl border border-gray-200 p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin" />
            <p className="text-xs font-semibold text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    </section>
  );
}
