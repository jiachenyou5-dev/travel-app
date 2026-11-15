import Link from "next/link";

export function Pagination({ page, pageCount, pathname, filters = {} }: {
  page: number;
  pageCount: number;
  pathname: string;
  filters?: Record<string, string>;
}) {
  if (pageCount <= 1) return null;
  const href = (value: number) => `${pathname}?${new URLSearchParams({ ...filters, page: String(value) })}`;
  return (
    <nav aria-label="分页" className="flex items-center justify-center gap-4 mt-6">
      {page > 1 && <Link href={href(page - 1)} className="text-primary hover:underline">上一页</Link>}
      <span className="text-sm text-muted-foreground">第 {page} / {pageCount} 页</span>
      {page < pageCount && <Link href={href(page + 1)} className="text-primary hover:underline">下一页</Link>}
    </nav>
  );
}
