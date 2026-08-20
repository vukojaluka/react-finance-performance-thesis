import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type DashboardWidgetErrorProps = {
  title: string
  message?: string
  onRetry?: () => void
}

export function DashboardWidgetError({
  title,
  message = 'Nije moguće učitati podatke.',
  onRetry,
}: DashboardWidgetErrorProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          {title}
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
