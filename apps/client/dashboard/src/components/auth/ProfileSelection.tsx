import { Button, Card, CardHeader, Input } from "@nextui-org/react";
import { IconTrash } from "@tabler/icons-react";
import { useProfiles } from "../../hooks/use-profiles";
import { ConfirmationModal, Modal, useModal } from "../ui/Modal";
import { type Profile } from "@monyfox/common-data";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function ProfileSelection() {
  const { profiles, createProfile, deleteProfile } = useProfiles();

  return (
    <div className="p-4">
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
          <span>{profile.user}</span>
          <div className="flex gap-2">
            <Button color="primary" variant="ghost">
              <Link to="/p/$profileId" params={{ profileId: profile.id }}>
                Open
              </Link>
            </Button>
            <Button
              onPress={openModal}
              color="danger"
              variant="ghost"
              isIconOnly
            >
              <IconTrash size={16} />
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
            actionButtonColor="danger"
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
      <Button onPress={openModal}>Create Profile</Button>
      <CreateProfileModal
        isOpen={isOpen}
        onClose={closeModal}
        createProfile={createProfile}
      />
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
      title="Create Profile"
      footer={
        <div className="flex justify-end gap-2">
          <Button onPress={onClose}>Cancel</Button>
          <Button
            onPress={() => {
              createProfile({
                id: crypto.randomUUID(),
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
            color="primary"
          >
            Create
          </Button>
        </div>
      }
    >
      <Input
        label="Profile Name"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
      />
    </Modal>
  );
}
