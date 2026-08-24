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
import { useDeleteTransaction } from '@/features/transactions/hooks/use-delete-transaction'

type TransactionDeleteDialogProps = {
  transactionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDeleteDialog({
  transactionId,
  open,
  onOpenChange,
}: TransactionDeleteDialogProps) {
  const deleteMutation = useDeleteTransaction()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteMutation.isPending) {
      return
    }

    onOpenChange(nextOpen)
  }

  async function handleConfirm() {
    if (!transactionId || deleteMutation.isPending) {
      return
    }

    try {
      await deleteMutation.mutateAsync(transactionId)
      onOpenChange(false)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obriši transakciju?</AlertDialogTitle>
          <AlertDialogDescription>
            Jeste li sigurni da želite obrisati ovu transakciju? Ova radnja se
            ne može poništiti.
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
