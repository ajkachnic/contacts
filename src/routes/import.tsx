import Parser from "@gregoranders/csv";
import { Container, Flex, Heading } from "@radix-ui/themes";
import { useRef, useState } from "react";

interface ImportedContact {
  Name: string;
  "Given Name": string;
  "Family Name": string;
  "Phone 1 - Value": string;
  "Organization 1 - Name": string;
}

export default function Import() {
  const parser = new Parser();
  const fileInput = useRef<HTMLInputElement>(null);

  const [contacts, setContacts] = useState<ImportedContact[]>([]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      parser.parse(data);
      console.log(parser.json);
    };

    reader.readAsText(file);
  };

  return (
    <Flex justify="center" height="100vh" p="8">
      <Container maxWidth="1000px">
        <Heading as="h1" size="7" mb="2">
          Import Contacts
        </Heading>
        <input type="file" ref={fileInput} onChange={handleFileInputChange} />
      </Container>
    </Flex>
  );
}
