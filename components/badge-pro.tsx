import { FaLock, FaUnlock } from "react-icons/fa";
import { Badge } from "./ui/badge";

interface BadgePro {
  locked: boolean | null | undefined;
  hideLabel?: boolean;
}

export default function BadgePro(props: BadgePro) {
  const { locked, hideLabel = false } = props;
  return (
    <Badge className="flex gap-2" variant={locked ? "default" : "secondary"}>
      {hideLabel ? null : (
        <p className="text-sm">{locked ? "Pro:" : "Public"}</p>
      )}
      {locked ? <FaLock /> : <FaUnlock />}
    </Badge>
  );
}
