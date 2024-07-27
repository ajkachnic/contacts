import { useEffect, useState } from "react";
import useSWR from "swr";
import { Link, useLocation } from "wouter";
import {
  Button,
  Container,
  Flex,
  Link as ThemedLink,
  Text,
  TextField,
} from "@radix-ui/themes";

import { RecordModel } from "pocketbase";

import { pb } from "../utils";
import { StaticContact, EditingContact } from "../components/contact";
import { createEmpty } from "../lib/contact";

export default function Index() {
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, [navigate]);

  const [selected, setSelected] = useState<string | null>(null);
  const { data, error, isLoading, mutate } = useSWR("contacts", (k: string) =>
    pb.collection(k).getFullList()
  );

  const addContact = async () => {
    const r = await createEmpty();
    await mutate([...(data ?? []), r]);
    setSelected(r.id);
  };

  return (
    <Flex justify="center" minHeight="100vh" p="8">
      <Container maxWidth="800px" height={"fit-content"}>
        <Flex align="center" className="w-full" gap="2" mb="4">
          <Text weight="bold">contacts</Text>
          <TextField.Root
            placeholder={`search ${data?.length || ""} contacts...`}
            variant="surface"
            style={{ flexGrow: 1 }}
          />
          <Button variant="soft" onClick={addContact} disabled={isLoading}>
            add
          </Button>
        </Flex>
        {isLoading && <Text as="p">Loading...</Text>}
        {error && <Text as="p">Error: {error.message}</Text>}
        {data && (
          <Contacts
            contacts={data}
            mutate={mutate}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </Container>
    </Flex>
  );
}

function Contacts({
  contacts,
  mutate,
  selected,
  setSelected,
}: {
  contacts: RecordModel[];
  mutate: (data: RecordModel[]) => void;

  selected: string | null;
  setSelected: (id: string | null) => void;
}) {
  const mutateContact = (i: number) => (contact: RecordModel) =>
    mutate([...contacts.slice(0, i), contact, ...contacts.slice(i + 1)]);

  if (contacts.length === 0) {
    return (
      <Text as="p" my="4">
        No contacts found. Try{" "}
        <ThemedLink asChild>
          <Link to="/import">importing</Link>
        </ThemedLink>{" "}
        or adding them
      </Text>
    );
  }

  return (
    <Flex gap="4" direction="column">
      {contacts.map((contact, i) =>
        selected === contact.id ? (
          <EditingContact
            key={contact.id}
            contact={contact}
            setSelected={setSelected}
            setContact={mutateContact(i)}
          />
        ) : (
          <StaticContact
            key={contact.id}
            contact={contact}
            setSelected={setSelected}
          />
        )
      )}
    </Flex>
  );
}
