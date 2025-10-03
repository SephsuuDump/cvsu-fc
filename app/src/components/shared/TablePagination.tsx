import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dispatch, SetStateAction } from "react";

export function TablePagination({ data, page, size, setPage }: {
    data: any[];
    page: number;
    size: number;
    setPage: Dispatch<SetStateAction<number>>;
}) {
    return (
        <div className="flex-center-y justify-between">
            <div className="text-sm text-gray">Showing { size } of { data.length } items</div>
            <Pagination className="justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={() => setPage((p: number) => Math.max(p - 1, 0))}
                            aria-disabled={page === 0}
                        />
                    </PaginationItem>

                    {Array.from({ length: Math.ceil((data?.length ?? 0) / size) }).map((_, i) => (
                    <PaginationItem key={i}>
                            <PaginationLink
                                className="cursor-pointer"
                                isActive={i === page}
                                onClick={() => setPage(i)}
                            >
                                {i + 1}
                            </PaginationLink>
                    </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={() => setPage((p) =>
                            Math.min(p + 1, Math.ceil((data?.length ?? 0) / size) - 1)
                            )}
                            aria-disabled={page >= Math.ceil((data?.length ?? 0) / size) - 1}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}