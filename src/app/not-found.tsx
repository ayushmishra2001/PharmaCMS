export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-emerald-400">404</h1>
        <p className="mt-4 text-xl text-slate-400">Page not found</p>
      </div>
    </div>
  );
}
