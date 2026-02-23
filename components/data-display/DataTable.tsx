import { cn } from '@/lib/utils/cn';

/* ==========================================
 * DataTable – Generic column-driven table
 * ========================================== */

export interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
    emptyMessage?: string;
    className?: string;
}

export function DataTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = 'No data available',
    className,
}: DataTableProps<T>) {
    return (
        <div className={cn('overflow-x-auto rounded-xl border border-border', className)}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    'text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap',
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr
                                key={keyExtractor(row)}
                                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={cn('px-4 py-3', col.className)}>
                                        {col.render
                                            ? col.render(row)
                                            : String((row as Record<string, unknown>)[col.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
