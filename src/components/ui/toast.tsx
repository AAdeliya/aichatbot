import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: "border border-border bg-background text-foreground",
        duration: 3000,
      }}
      {...props}
    />
  );
}

export { Toaster };
