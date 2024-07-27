import {
  Button,
  Card,
  DataList,
  Flex,
  Grid,
  TextArea,
  TextField,
} from "@radix-ui/themes";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { RecordModel } from "pocketbase";
import { useForm } from "react-hook-form";

import { pb } from "../utils";
import { multiProperties, singleProperties } from "../lib/contact";

export function StaticContact({
  contact,
  setSelected,
}: {
  contact: RecordModel;
  setSelected: (contactId: string) => void;
}) {
  return (
    <Card className="w-full relative">
      <Grid columns="2" className="w-full">
        <DataList.Root>
          {singleProperties.map(([column, label, , , render]) => (
            <DataList.Item key={column}>
              <DataList.Label minWidth="60px">{label}</DataList.Label>
              <DataList.Value>
                {render ? render(contact[column]) : contact[column]}
              </DataList.Value>
            </DataList.Item>
          ))}
        </DataList.Root>
        <DataList.Root>
          <DataList.Root>
            {multiProperties.map(([column, label, , , render]) => (
              <DataList.Item key={column}>
                <DataList.Label minWidth="60px">{label}</DataList.Label>
                <DataList.Value>
                  {render
                    ? render(contact[column])
                    : contact[column]?.join(", ")}
                </DataList.Value>
              </DataList.Item>
            ))}
          </DataList.Root>
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

export function EditingContact({
  contact,
  setSelected,
  setContact,
}: {
  contact: RecordModel;
  setSelected: (contactId: string | null) => void;
  setContact: (contact: RecordModel) => void;
}) {
  const { register, handleSubmit, formState } = useForm();

  // TODO: use form library here, it's a mess
  const onSubmit = async (data: any) => {
    const record: Record<string, unknown> = {};
    for (const [field] of singleProperties) {
      record[field] = data[field];
    }
    for (const [field] of multiProperties) {
      record[field] = data[field].split(",").map((p) => p.trim());
    }

    const result = await pb.collection("contacts").update(contact.id, record);
    // TODO: optimistic update
    setContact(result);
    setSelected(null);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid columns="2" className="w-full">
          <DataList.Root>
            {singleProperties.map(([column, label, placeholder, multiline]) => (
              <DataList.Item key={column}>
                <DataList.Label minWidth="60px">{label}</DataList.Label>
                <DataList.Value>
                  {multiline ? (
                    <TextArea
                      placeholder={placeholder}
                      defaultValue={contact[column]}
                      {...register(column)}
                    />
                  ) : (
                    <TextField.Root
                      defaultValue={contact[column]}
                      placeholder={placeholder}
                      {...register(column)}
                    />
                  )}
                </DataList.Value>
              </DataList.Item>
            ))}
          </DataList.Root>
          <DataList.Root>
            {multiProperties.map(([column, label, placeholder, multiline]) => (
              <DataList.Item key={column}>
                <DataList.Label minWidth="60px">{label}</DataList.Label>
                <DataList.Value>
                  {multiline ? (
                    <TextArea
                      placeholder={placeholder}
                      defaultValue={contact[column]}
                      {...register(column)}
                    />
                  ) : (
                    <TextField.Root
                      placeholder={placeholder}
                      defaultValue={contact[column]}
                      {...register(column)}
                    />
                  )}
                </DataList.Value>
              </DataList.Item>
            ))}
          </DataList.Root>
        </Grid>
        <Flex justify="end" gap="2">
          <Button
            variant="soft"
            onClick={() => setSelected(null)}
            type="button"
          >
            cancel
          </Button>
          <Button
            variant="solid"
            type="submit"
            disabled={formState.isSubmitting}
          >
            save
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
