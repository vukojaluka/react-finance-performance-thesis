import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type WidgetFallbackProps = {
  title: string
  milestone: 'chart' | 'transactions' | 'budgets'
}

export function WidgetFallback({ title, milestone }: WidgetFallbackProps) {
  return (
    <Card size="sm" className="h-full min-w-0" data-exp-fallback={milestone}>
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Loading...</p>
      </CardContent>
    </Card>
  )
}
