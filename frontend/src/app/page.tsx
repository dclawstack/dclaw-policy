import Link from 'next/link';
import { ScrollText } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <ScrollText className="w-16 h-16 text-brand" />
      <h1 className="text-4xl font-bold text-[#3B82F6]">DClaw Policy</h1>
      <p className="text-lg text-slate-600">Policy management & enforcement</p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
