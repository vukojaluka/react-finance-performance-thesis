import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type BudgetsErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function BudgetsErrorState({
  message = 'Nije moguće učitati budžete.',
  onRetry,
}: BudgetsErrorStateProps) {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Greška pri učitavanju
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{message}</p>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Pokušaj ponovno
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
