import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-forest-900 group-[.toaster]:text-gold-100 group-[.toaster]:border-gold-400/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gold-100/60",
          actionButton: "group-[.toast]:bg-gold-400 group-[.toast]:text-forest-950",
          cancelButton: "group-[.toast]:bg-forest-800 group-[.toast]:text-gold-100/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
