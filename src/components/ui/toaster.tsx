import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map(({ id, title, description, variant }) => (
        <div key={id} className={`rounded-lg border p-4 shadow-lg text-sm ${variant === 'destructive' ? 'bg-red-950 border-red-500 text-red-200' : 'bg-forest-900 border-gold-400/20 text-gold-100'}`}>
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="mt-1 opacity-80">{description}</div>}
        </div>
      ))}
    </div>
  )
}
