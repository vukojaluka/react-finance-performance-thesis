import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CategoryFormSkeleton() {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Skeleton className="h-10 w-full sm:w-28" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </CardFooter>
    </Card>
  )
}
