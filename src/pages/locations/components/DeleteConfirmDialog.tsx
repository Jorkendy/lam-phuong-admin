/**
 * Delete confirmation dialog component
 */

import { Button } from '@/components/ui/button'

interface DeleteConfirmDialogProps {
  open: boolean
  ids: string[]
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({
  open,
  ids,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
      onClick={onCancel}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200" />
      
      {/* Dialog Container */}
      <div 
        className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border-2 border-border overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-destructive/20 flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-destructive"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground leading-tight">
                Delete Location{ids.length > 1 ? 's' : ''}?
              </h2>
              <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                {ids.length === 1
                  ? 'This action cannot be undone. The location will be permanently deleted.'
                  : `Are you sure you want to delete ${ids.length} locations? This action cannot be undone.`}
              </p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t-2 border-border my-5" />

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-end gap-3">
            <Button 
              type="button" 
              variant="ghost"
              onClick={onCancel} 
              disabled={deleting}
              className="px-5 h-9 font-medium text-foreground/90 hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={onConfirm}
              disabled={deleting}
              className="px-5 h-9 font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  <span>Deleting...</span>
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

