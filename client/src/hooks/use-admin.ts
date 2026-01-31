import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

export function useUploadTally() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => api.admin.uploadTally(file),
    onSuccess: (data) => {
      toast({
        title: "Import Successful",
        description: `Processed: ${data.stats.processed}, Errors: ${data.stats.errors}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
