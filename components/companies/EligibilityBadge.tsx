import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EligibilityBadgeProps {
  isEligible: boolean;
}

export function EligibilityBadge({ isEligible }: EligibilityBadgeProps) {
  if (isEligible) {
    return (
      <Badge variant="success">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        Eligible
      </Badge>
    );
  }

  return (
    <Badge variant="muted">
      <XCircle className="h-3 w-3" aria-hidden="true" />
      Not eligible
    </Badge>
  );
}
