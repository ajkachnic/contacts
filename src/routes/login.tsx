import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Label } from "@radix-ui/react-label";
import { useLocation } from "wouter";

import { pb } from "../utils";

export default function Login() {
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await pb.admins.authWithPassword(email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Container maxWidth="400px">
        <form onSubmit={handleSubmit}>
          <Box mb="4">
            <Heading as="h1" size="7" mb="2">
              Log in
            </Heading>
            <Text>Please log in with admin credentials to continue.</Text>
          </Box>
          <Flex gap="4" direction="column">
            <Label>
              <Text as="span" size="2" weight="bold">
                Email
              </Text>
              <TextField.Root
                mt="1"
                size="2"
                placeholder="Enter your email"
                type="email"
                variant="surface"
                name="email"
              />
            </Label>
            <Label>
              <Text as="span" size="2" weight="bold">
                Password
              </Text>
              <TextField.Root
                mt="1"
                size="2"
                placeholder="Enter your password"
                type="password"
                variant="surface"
                name="password"
              />
            </Label>
            <Button type="submit" className="w-full" variant="solid">
              Log in
            </Button>
          </Flex>
        </form>
      </Container>
    </Flex>
  );
}
