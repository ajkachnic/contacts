import { Link } from "@radix-ui/themes";
import { formatPhoneNumber, pb } from "../utils";

export type Property = {
  column: string;
  label: string;
  placeholder: string;
  multiline: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (v: any) => any;
};

const property = (
  c: string,
  multiline = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: ((v: any) => any) | undefined = undefined
): Property => ({
  column: c,
  label: c,
  placeholder: c,
  multiline,
  render,
});

// TODO: refactor to use a struct
export const singleProperties: Property[] = [
  // column, label, placeholder, multiline?, render
  property("name"),
  property("place"),
  property("work"),
  { ...property("last"), placeholder: "last met..." },
  property("notes", true, (v) => (
    <div dangerouslySetInnerHTML={{ __html: v }} />
  )),
];

export const multiProperties: Property[] = [
  // column, label, placeholder, multiline?
  property("phone", false, (v) => formatPhoneNumber(v)),
  property("email", false, (v) => <Link href={`mailto:${v}`}>{v}</Link>),
  property("social"),
  property("website", false, (v) => <Link href={v}>{v}</Link>),
  { ...property("meetings", true), label: "mtg" },
];

// Avoid recalculating on every search
const GENERATED_FILTER = [...singleProperties, ...multiProperties]
  .map(({ column }) => `${column} ~ {:query}`)
  .join(" || ");

const DEFAULT = Object.fromEntries([
  ...singleProperties.map(({ column }) => [column, ""]),
  ...multiProperties.map(({ column }) => [column, []]),
]);

export function search(query: string, limit: number = 20) {
  return pb.collection("contacts").getList(1, limit, {
    filter: pb.filter(GENERATED_FILTER, { query }),
  });
}

export function createEmpty() {
  return pb.collection("contacts").create(DEFAULT);
}
