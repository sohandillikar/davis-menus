import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSignInModalContext } from "@/contexts/SignInModalContext";

export function SignInModal() {
  const { signIn } = useAuthContext();
  const { isOpen, setIsOpen, mode } = useSignInModalContext();

  const modes = {
    "mealPlanner": {
      title: "Hey there!",
      description: "Please sign in to access personalized meal recommendations :)",
      googleButtonText: "Continue"
    },
    favorites: {
      "title": "Hey there!",
      description: "Please sign in to save your favorite menu items :)",
      googleButtonText: "Continue"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">{modes[mode].title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {modes[mode].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <Button 
            className="w-full gap-3 py-6 text-base font-medium hover:bg-gray-50 hover:text-gray-900"
            variant="outline"
            onClick={signIn}
          >
            <FcGoogle className="h-5 w-5" />
            {modes[mode].googleButtonText} with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}