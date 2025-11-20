import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface JobStatusBadgeProps {
  status: string | undefined | null
  deadline: string | undefined
  postingId: string
  onStatusChange: (postingId: string, newStatus: string) => Promise<void>
  updating?: boolean
}

const STATUS_OPTIONS = [
  { id: 'Draft', label: 'Draft', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  { id: 'Approved', label: 'Approved', color: 'text-green-700', bgColor: 'bg-green-100' },
  { id: 'Rejected', label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
]

function getStatusBadge(
  status: string | undefined | null,
  deadline: string | undefined
): { label: string; color: string; bgColor: string } {
  // Check if deadline has passed
  if (deadline) {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    if (deadlineDate < now) {
      return {
        label: "Expired",
        color: "text-red-700",
        bgColor: "bg-red-100",
      }
    }
  }

  // Check status field
  if (status === "Approved") {
    return {
      label: "Approved",
      color: "text-green-700",
      bgColor: "bg-green-100",
    }
  }

  if (status === "Rejected" || status === "Reject") {
    return {
      label: "Rejected",
      color: "text-red-700",
      bgColor: "bg-red-100",
    }
  }

  if (status === "Draft") {
    return {
      label: "Draft",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    }
  }

  // Pending (null/undefined/empty) - legacy status
  return {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  }
}

export function JobStatusBadge({ status, deadline, postingId, onStatusChange, updating = false }: JobStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const statusBadge = getStatusBadge(status, deadline)
  const currentStatus = status || 'Pending'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleStatusSelect = async (newStatus: string) => {
    if (newStatus === currentStatus || updating) return
    
    try {
      await onStatusChange(postingId, newStatus)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update status:', error)
      // Keep dropdown open on error so user can retry
    }
  }

  // Don't show dropdown for Expired status (can't change expired status)
  const isExpired = deadline && new Date(deadline) < new Date()

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!isExpired && !updating) {
            setIsOpen(!isOpen)
          }
        }}
        disabled={isExpired || updating}
        className={cn(
          'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
          statusBadge.bgColor,
          statusBadge.color,
          !isExpired && !updating && 'hover:opacity-80 cursor-pointer',
          (isExpired || updating) && 'cursor-not-allowed opacity-75'
        )}
        title={isExpired ? 'Cannot change expired status' : 'Click to change status'}
      >
        {updating ? (
          <span className="flex items-center gap-1.5">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"></div>
            <span>Updating...</span>
          </span>
        ) : (
          statusBadge.label
        )}
      </button>

      {isOpen && !isExpired && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[140px] overflow-hidden">
          <div className="p-1">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = 
                (currentStatus === option.id) || 
                (option.id === 'Draft' && !status && currentStatus === 'Pending') ||
                (option.id === 'Rejected' && (status === 'Reject' || status === 'Rejected'))
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusSelect(option.id)
                  }}
                  disabled={updating}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-left',
                    isSelected && 'bg-gray-50 font-medium',
                    updating && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className={cn('text-xs px-2 py-0.5 rounded', option.bgColor, option.color)}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary ml-auto"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

