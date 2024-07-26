import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  contactSchema,
  formatPhoneNumber,
  pb,
  useResource,
  useSubscription,
} from "../utils";
import {
  Button,
  Container,
  Flex,
  Link as ThemedLink,
  Text,
  TextField,
  DataList,
  Card,
  Grid,
} from "@radix-ui/themes";
import { ListResult, RecordModel } from "pocketbase";
import { InferOutput } from "valibot";
import { Pencil1Icon } from "@radix-ui/react-icons";

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
        {/* {contacts.error && <Text as="p">Error: {contacts.error.message}</Text>} */}
        {contacts.data && <Contacts contacts={contacts.data} />}
      </Container>
    </Flex>
  );
}

function Contacts({ contacts }: { contacts: ListResult<RecordModel> }) {
  const [selected, setSelected] = useState<string | null>(null);
  console.log(selected);

  if (contacts.items.length === 0) {
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
      {contacts.items.map((contact) =>
        selected === contact.id ? (
          <EditingContact
            key={contact.id}
            contact={contact}
            setSelected={setSelected}
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

function StaticContact({
  contact,
  setSelected,
}: {
  contact: InferOutput<typeof contactSchema>;
  setSelected: (contactId: string) => void;
}) {
  return (
    <Card className="w-full relative">
      <Grid columns="2" className="w-full">
        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="60px">name</DataList.Label>
            <DataList.Value>{contact.name}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="60px">place</DataList.Label>
            <DataList.Value>{contact.place}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="60px">work</DataList.Label>
            <DataList.Value>{contact.work}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="60px">notes</DataList.Label>
            <DataList.Value>{contact.notes}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="60px" style={{ textAlign: "right" }}>
              phone
            </DataList.Label>
            <DataList.Value>
              {contact.phone.map((phone) => (
                <Text key={phone}>{formatPhoneNumber(phone)}</Text>
              ))}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="60px">email</DataList.Label>
            <DataList.Value>
              {contact.email.map((email) => (
                <ThemedLink key={email} href={`mailto:${email}`}>
                  {email}
                </ThemedLink>
              ))}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="60px">socials</DataList.Label>
            <DataList.Value>
              {contact.social.map((social) => (
                <Text key={social}>{social}</Text>
              ))}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="60px">website</DataList.Label>
            <DataList.Value>
              <ThemedLink href={contact.website}>{contact.website}</ThemedLink>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Grid>
      <Button
        variant="soft"
        color="gray"
        onClick={() => setSelected(contact.id)}
        style={{
          position: "absolute",
          top: ".5rem",
          right: ".5rem",
          paddingInline: "0.5rem",
        }}
      >
        <Pencil1Icon />
      </Button>
    </Card>
  );
}

function EditingContact({
  contact,
  setSelected,
}: {
  contact: InferOutput<typeof contactSchema>;
  setSelected: (contactId: string | null) => void;
}) {
  const [name, setName] = useState(contact.name);
  const [place, setPlace] = useState(contact.place);
  const [work, setWork] = useState(contact.work);
  const [notes, setNotes] = useState(contact.notes);
  const [website, setWebsite] = useState(contact.website);
  const [phone, setPhone] = useState(contact.phone.join(", "));
  const [email, setEmail] = useState(contact.email.join(", "));
  const [social, setSocial] = useState(contact.social.join(", "));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    pb.collection("contacts").update(contact.id, {
      ...contact,
      name,
      place,
      work,
      notes,
      website,
      phone: phone.split(",").map((p) => p.trim()),
      email: email.split(",").map((e) => e.trim()),
      social: social.split(",").map((s) => s.trim()),
    });
    setIsSubmitting(false);
    setSelected(null);
  };

  return (
    <Card>
      <Grid columns="2" className="w-full">
        <DataList.Root>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">name</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">place</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">work</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={work}
                onChange={(e) => setWork(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">notes</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
        <DataList.Root>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px" style={{ textAlign: "right" }}>
              phone
            </DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">email</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">socials</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={social}
                onChange={(e) => setSocial(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item className="items-center">
            <DataList.Label minWidth="60px">website</DataList.Label>
            <DataList.Value>
              <TextField.Root
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Grid>
      <Flex justify="end" gap="2">
        <Button variant="soft" onClick={() => setSelected(null)}>
          cancel
        </Button>
        <Button variant="solid" onClick={handleSubmit} disabled={isSubmitting}>
          save
        </Button>
      </Flex>
    </Card>
  );
}
