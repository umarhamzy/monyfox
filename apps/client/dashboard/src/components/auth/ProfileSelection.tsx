import { cn } from "@/lib/utils";
import { useProfiles } from "../../hooks/use-profiles";
import { ConfirmationModal, Modal, useModal } from "../ui/modal";
import { type Profile } from "@monyfox/common-data";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { ulid } from "ulid";
import { generateTestProfile } from "@/utils/data";

export function ProfileSelection({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { profiles, createProfile, deleteProfile } = useProfiles();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Select a profile to login or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                deleteProfile={deleteProfile}
              />
            ))}
          </ul>
          <div className="h-4" />
          <CreateProfile createProfile={createProfile} />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileCard({
  profile,
  deleteProfile,
}: {
  profile: Profile;
  deleteProfile: (id: string) => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <CardTitle>{profile.user}</CardTitle>
          <div className="flex gap-2">
            <Link to="/p/$profileId" params={{ profileId: profile.id }}>
              <Button color="primary" variant="default">
                Open
              </Button>
            </Link>
            <Button size="icon" onClick={openModal} variant="outline">
              <TrashIcon />
            </Button>
          </div>
          <ConfirmationModal
            isOpen={isOpen}
            onClose={closeModal}
            title="Delete Profile"
            onConfirm={() => {
              deleteProfile(profile.id);
              closeModal();
            }}
            confirmText="Delete"
            cancelText="Cancel"
            actionButtonVariant="destructive"
          >
            Are you sure you want to delete this profile?
          </ConfirmationModal>
        </div>
      </CardHeader>
    </Card>
  );
}

function CreateProfile({
  createProfile,
}: {
  createProfile: (profile: Profile) => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div className="flex flex-col items-center">
      <Button onClick={openModal}>Create profile</Button>
      <CreateProfileModal
        isOpen={isOpen}
        onClose={closeModal}
        createProfile={createProfile}
      />
      <hr className="my-4 w-full" />
      <CreateTestProfileButton createProfile={createProfile} />
    </div>
  );
}

function CreateProfileModal({
  isOpen,
  onClose,
  createProfile,
}: {
  isOpen: boolean;
  onClose: () => void;
  createProfile: (profile: Profile) => void;
}) {
  const [profileName, setProfileName] = useState("");
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create profile"
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            onClick={() => {
              createProfile({
                id: ulid(),
                user: profileName,
                data: {
                  encrypted: false,
                  data: {
                    accounts: [],
                    assetSymbols: [],
                    transactions: [],
                    lastUpdated: new Date().toISOString(),
                  },
                },
                schemaVersion: "1",
              });
              onClose();
              setProfileName("");
            }}
            variant="default"
          >
            Create
          </Button>
        </div>
      }
    >
      <InputWithLabel
        type="text"
        id="profileName"
        label="Profile Name"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
      />
    </Modal>
  );
}

function CreateTestProfileButton({
  createProfile,
}: {
  createProfile: (profile: Profile) => void;
}) {
  function onClick() {
    const profile = generateTestProfile();
    createProfile(profile);
  }

  return (
    <Button onClick={onClick} variant="secondary">
      Create a test profile
    </Button>
  );
}
