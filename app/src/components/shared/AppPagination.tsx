import { Button } from "@/components/ui/button"

type PaginationProps = {
    totalItems: number
    itemsPerPage?: number
    currentPage: number
    onPageChange: (page: number) => void
}

export function AppPagination({
    totalItems,
    itemsPerPage = 10,
    currentPage,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    if (totalPages <= 1) return null

    const startItem = ((currentPage - 1) * itemsPerPage + 1) + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
                Showing {startItem}–{endItem} of {totalItems}
            </div>

            <div className="flex gap-1">
                <Button
                    variant="outline"
                    disabled={currentPage === 0}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Prev
                </Button>

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
