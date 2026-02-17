import { Button } from "@/components/ui/button"

type PaginationProps = {
    totalItems: number
    itemsPerPage?: number
    currentPage: number
    onPageChange: (page: number) => void
}

function getMobilePages(current: number, total: number) {
    const pages = new Set<number>()
    pages.add(1)
    pages.add(total)
    pages.add(current)
    if (current + 1 <= total) pages.add(current + 1) // ✅ only succeeding page
    // optional: keep previous too if you want -> pages.add(current - 1)

    return Array.from(pages)
        .filter((p) => p >= 1 && p <= total)
        .sort((a, b) => a - b)
}

export function AppPagination({
    totalItems,
    itemsPerPage = 10,
    currentPage,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (totalPages <= 1) return null

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    const mobilePages = getMobilePages(currentPage, totalPages)

    return (
        <div className="flex justify-between items-center mt-4 max-md:flex-col max-sm:gap-4">
            <div className="text-sm text-muted-foreground">
                Showing {startItem}–{endItem} of {totalItems}
            </div>

            <div className="flex gap-1 items-center">
                <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Prev
                </Button>

                {/* Desktop: show all pages */}
                <div className="hidden sm:flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1
                        return (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </Button>
                        )
                    })}
                </div>

                {/* Mobile: show 1 … current current+1 … last */}
                <div className="flex sm:hidden gap-1 items-center">
                    {mobilePages.map((page, idx) => {
                        const prev = mobilePages[idx - 1]
                        const needsEllipsis = idx > 0 && page - (prev ?? 0) > 1

                        return (
                            <span key={page} className="flex items-center gap-1">
                                {needsEllipsis && (
                                    <span className="px-2 text-muted-foreground select-none">…</span>
                                )}
                                <Button
                                    variant={page === currentPage ? "default" : "outline"}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </Button>
                            </span>
                        )
                    })}
                </div>

                <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}