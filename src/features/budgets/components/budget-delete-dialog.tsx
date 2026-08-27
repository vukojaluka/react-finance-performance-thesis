import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteBudget } from '@/features/budgets/hooks/use-delete-budget'

type BudgetDeleteDialogProps = {
  budgetId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BudgetDeleteDialog({
  budgetId,
  open,
  onOpenChange,
}: BudgetDeleteDialogProps) {
  const deleteMutation = useDeleteBudget()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteMutation.isPending) {
      return
    }

    onOpenChange(nextOpen)
  }

  async function handleConfirm() {
    if (!budgetId || deleteMutation.isPending) {
      return
    }

    try {
      await deleteMutation.mutateAsync(budgetId)
      onOpenChange(false)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obriši budžet?</AlertDialogTitle>
          <AlertDialogDescription>
            Jeste li sigurni da želite obrisati ovaj budžet? Ova radnja se ne
            može poništiti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Odustani
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="sm"
            disabled={deleteMutation.isPending}
            onClick={() => void handleConfirm()}
          >
            {deleteMutation.isPending ? 'Brišem...' : 'Obriši'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
