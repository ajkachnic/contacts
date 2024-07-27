import { Link } from "@radix-ui/themes";
import { formatPhoneNumber, pb } from "../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Property = [string, string, string, boolean?, ((v: any) => any)?];

// TODO: refactor to use a struct
export const singleProperties: Property[] = [
  // column, label, placeholder, multiline?, render
  ["name", "name", "name", false],
  ["place", "place", "place", false],
  ["work", "work", "work", false],
  ["last", "last", "last met...", false],
  [
    "notes",
    "notes",
    "notes",
    true,
    (v) => <div dangerouslySetInnerHTML={{ __html: v }} />,
  ],
];

export const multiProperties: Property[] = [
  // column, label, placeholder, multiline?
  ["phone", "phone", "phone", false, (v) => formatPhoneNumber(v)],
  [
    "email",
    "email",
    "email",
    false,
    (v) => <Link href={`mailto:${v}`}>{v}</Link>,
  ],
  ["social", "social", "social", false],
  ["website", "website", "website", false, (v) => <Link href={v}>{v}</Link>],
  ["meetings", "mtg", "meeting", true],
];

// Avoid recalculating on every search
const GENERATED_FILTER = [...singleProperties, ...multiProperties]
  .map(([column]) => `${column} ~ {:query}`)
  .join(" || ");

const DEFAULT = Object.fromEntries([
  ...singleProperties.map(([column]) => [column, ""]),
  ...multiProperties.map(([column]) => [column, []]),
]);

export function search(query: string, limit: number = 20) {
  return pb.collection("contacts").getList(1, limit, {
    filter: pb.filter(GENERATED_FILTER, { query }),
  });
}

export function createEmpty() {
  return pb.collection("contacts").create(DEFAULT);
}
