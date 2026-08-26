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
import { useDeleteCategory } from '@/features/categories/hooks/use-delete-category'

type CategoryDeleteDialogProps = {
  categoryId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDeleteDialog({
  categoryId,
  open,
  onOpenChange,
}: CategoryDeleteDialogProps) {
  const deleteMutation = useDeleteCategory()

  function handleOpenChange(nextOpen: boolean) {
    if (deleteMutation.isPending) {
      return
    }

    onOpenChange(nextOpen)
  }

  async function handleConfirm() {
    if (!categoryId || deleteMutation.isPending) {
      return
    }

    try {
      await deleteMutation.mutateAsync(categoryId)
      onOpenChange(false)
    } catch {
      // Error toast is handled in the mutation hook.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Obriši kategoriju?</AlertDialogTitle>
          <AlertDialogDescription>
            Jeste li sigurni da želite obrisati ovu kategoriju? Ova radnja se ne
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
