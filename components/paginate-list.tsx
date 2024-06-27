import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function PaginateList({
  base,
  num,
  limit,
  count,
}: {
  base: string;
  num: number;
  limit: number;
  count: number;
}) {
  const pageNumber = Number(num);
  const offset = (pageNumber - 1) * limit;
  const offsetLimit = offset + limit;
  const total = Math.ceil((count || 1) / limit);

  return (
    <div className="flex justify-between">
      <Pagination>
        <PaginationContent>
          {pageNumber > 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious href={`/${base}/page/${pageNumber - 1}`} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/${base}/page/1`}>1</PaginationLink>
              </PaginationItem>
            </>
          )}
          {pageNumber > 2 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationLink
              href={`/${base}/page/${pageNumber}`}
              isActive={true}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
          {pageNumber < total - 1 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          {pageNumber !== total && (
            <PaginationItem>
              <PaginationLink href={`/${base}/page/${total}`}>
                {total}
              </PaginationLink>
            </PaginationItem>
          )}
          {pageNumber < total && (
            <PaginationItem>
              <PaginationNext href={`/${base}/page/${pageNumber + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
