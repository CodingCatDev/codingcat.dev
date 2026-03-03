import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileVideo, Flag, Handshake, DollarSign } from "lucide-react"

const metrics = [
  {
    title: "Videos Published",
    value: "—",
    description: "Total automated videos published",
    icon: FileVideo,
  },
  {
    title: "Flagged for Review",
    value: "—",
    description: "Content ideas needing attention",
    icon: Flag,
  },
  {
    title: "Sponsor Pipeline",
    value: "—",
    description: "Active sponsor leads",
    icon: Handshake,
  },
  {
    title: "Revenue",
    value: "—",
    description: "Monthly sponsor revenue",
    icon: DollarSign,
  },
]

export function SectionCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <CardDescription>{metric.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
