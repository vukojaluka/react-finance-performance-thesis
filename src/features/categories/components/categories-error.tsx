import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type CategoriesErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function CategoriesErrorState({
  message = 'Nije moguće učitati kategorije.',
  onRetry,
}: CategoriesErrorStateProps) {
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
