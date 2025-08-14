import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "@/contexts/AuthContext";

interface SignInModalProps {
  title: string;
  description: string;
  googleButtonText: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ title, description, googleButtonText, open, onOpenChange }: SignInModalProps) {
  const { signIn } = useAuthContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <Button 
            className="w-full gap-3 py-6 text-base font-medium hover:bg-gray-50 hover:text-gray-900"
            variant="outline"
            onClick={signIn}
          >
            <FcGoogle className="h-5 w-5" />
            {googleButtonText} with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}