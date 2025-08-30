import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef } from "react";
import { useDatabase } from "@/hooks/use-database";
import { toast } from "sonner";
import { ProfileSchema } from "@monyfox/common-data";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { getDataValidationErrors } from "@/utils/data";
import { Label } from "../ui/label";

export function ImportProfileForm({ onClose }: { onClose: () => void }) {
  const { profiles, saveProfile } = useDatabase();
  const fileRef = useRef<HTMLInputElement>(null);
  const submit = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const file = fileRef.current?.files?.[0];
      if (file === undefined) {
        throw new Error("No file selected");
      }

      return new Promise<void>((res, rej) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const content = e.target?.result;
          if (!content) {
            throw new Error("The file is empty");
          }

          try {
            const profile = ProfileSchema.parse(
              JSON.parse(z.string().parse(content)),
            );

            if (profile.data.encrypted === true) {
              throw new Error("Profile should not be encrypted");
            }

            if (profiles.findIndex((p) => p.id === profile.id) !== -1) {
              throw new Error("The profile already exists");
            }

            const errors = getDataValidationErrors(profile.data.data);
            if (errors.length > 0) {
              throw new Error(errors.join(". ") + ".");
            }

            saveProfile
              .mutateAsync(profile)
              .then(() => {
                onClose();
                toast.success("Profile imported successfully");
                res();
              })
              .catch(rej);
          } catch (e) {
            rej(e);
          }
        };

        reader.onerror = (e) => {
          console.error("Error reading the file", e);
          throw new Error("Error reading the file");
        };

        reader.readAsText(file);
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return (
    <form onSubmit={submit.mutate} className="space-y-4">
      <div className="hidden items-center gap-2 lg:flex">
        <Label htmlFor="file" className="text-sm font-medium">
          Your file
        </Label>
        <Input id="file" type="file" ref={fileRef} />
      </div>

      <div className="flex justify-end w-full gap-2">
        <Button type="button" onClick={onClose} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Import
        </Button>
      </div>
    </form>
  );
}
