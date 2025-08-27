import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAnalytics } from "@/hooks/use-analytics";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import { FormProvider, useForm } from "react-hook-form";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const methods = useForm();

  const { isTracking, toggleTracking } = useAnalytics();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy"
      description="Manage your privacy preferences."
      footer={
        <div className="flex justify-end w-full">
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <FormField
          name="analytics"
          render={() => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Analytics</FormLabel>
                <FormDescription>
                  We use Plausible Analytics, a privacy-friendly analytics
                  software that does not rely on cookies or persistent
                  identifiers to track visitors. That's why we don't have that
                  annoying cookies banner!
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={isTracking} onCheckedChange={toggleTracking} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="sell-data"
          render={() => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Sell my data</FormLabel>
                <FormDescription>
                  Whoops, you can't enable this. MonyFox will never sell your
                  data. Actually, we don't even have your data: it's only stored
                  locally in your browser.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={false} disabled={true} />
              </FormControl>
            </FormItem>
          )}
        />
      </FormProvider>
    </Modal>
  );
}

export function PrivacyLink() {
  const { isConfigured } = useAnalytics();
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      <div className="mt-4 text-center">
        <Button onClick={() => setIsPrivacyModalOpen(true)} variant="link">
          Privacy
        </Button>
      </div>
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
