/**
 * Loading skeleton for protected routes.
 * Displayed while server components stream in.
 */
export default function ProtectedLoading() {
    return (
        <div className="space-y-6 animate-pulse-subtle">
            {/* Page header skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-48 bg-muted rounded-lg" />
                <div className="h-4 w-80 bg-muted rounded-md" />
            </div>

            {/* KPI cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-xl" />
                ))}
            </div>

            {/* Chart skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-72 bg-muted rounded-xl" />
                <div className="h-72 bg-muted rounded-xl" />
            </div>

            {/* Table skeleton */}
            <div className="h-64 bg-muted rounded-xl" />
        </div>
    );
}
