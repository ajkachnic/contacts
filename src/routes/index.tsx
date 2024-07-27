import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Button,
  Container,
  Flex,
  Link as ThemedLink,
  Text,
  TextField,
} from "@radix-ui/themes";

import { ListResult, RecordModel } from "pocketbase";

import { pb, useResource } from "../utils";
import { StaticContact, EditingContact } from "../components/contact";

const getContacts = () => pb.collection("contacts").getList(1, 20);

export default function Index() {
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, [navigate]);

  const contacts = useResource(getContacts);

  return (
    <Flex justify="center" minHeight="100vh" p="8">
      <Container maxWidth="800px" height={"fit-content"}>
        <Flex align="center" className="w-full" gap="2" mb="4">
          <Text weight="bold">contacts</Text>
          <TextField.Root
            placeholder={`search ${
              contacts.data?.items.length || ""
            } contacts...`}
            variant="surface"
            style={{ flexGrow: 1 }}
          />
          <Button variant="soft">add</Button>
        </Flex>
        {contacts.loading && <Text as="p">Loading...</Text>}
        {contacts.error && <Text as="p">Error: {contacts.error.message}</Text>}
        {contacts.data && <Contacts contacts={contacts.data} />}
      </Container>
    </Flex>
  );
}

function Contacts({
  contacts: initial,
}: {
  contacts: ListResult<RecordModel>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [contacts, setContacts] = useState(initial.items);
  console.log(selected);

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
            setContact={(contact) =>
              setContacts([
                ...contacts.slice(0, i),
                contact,
                ...contacts.slice(i + 1),
              ])
            }
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
