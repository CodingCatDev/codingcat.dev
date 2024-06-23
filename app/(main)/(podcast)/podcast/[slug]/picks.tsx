import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PodcastQueryResult } from "@/sanity.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { FaExternalLinkSquareAlt } from "react-icons/fa";

export default async function PodcastPage({
  picks,
}: {
  picks: NonNullable<NonNullable<PodcastQueryResult>["pick"]>;
}) {
  const groupedPicks = picks.reduce(
    (acc, pick) => {
      const author = pick?.user?.title;
      if (!author) {
        return acc;
      }
      if (!acc?.[author]) {
        acc[author] = [];
      }
      acc[author].push(pick);
      return acc;
    },
    {} as Record<string, (typeof picks)[0][]>
  );

  const sortedPicks = Object.entries(groupedPicks).sort(([userA], [userB]) =>
    userA.localeCompare(userB)
  );

  return (
    <>
      {sortedPicks.map(([author, picksByAuthor]) => (
        <Card className="xl:col-span-2" key={author}>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="text-xl sm:text-2xl font-bold">
                {author}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-inherit">
                  <TableHead className="text-xl font-bold sm:text-2xl">
                    Picks
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {picksByAuthor.map((pick) => (
                  <TableRow key={pick.name}>
                    <TableCell className="p-0">
                      <Link
                        href={pick.site || ""}
                        target="_blank"
                        rel="noopener"
                      >
                        <div className="p-4 flex justify-between text-md sm:text-xl">
                          <div className="flex">{pick.name}</div>
                          <FaExternalLinkSquareAlt />
                        </div>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
