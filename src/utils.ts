import PocketBase from "pocketbase";
import * as v from "valibot";
import { useEffect, useState } from "react";

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
pb.autoCancellation(false);

export function useResource<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fn()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [fn]);

  return {
    data,
    loading,
    error,
  };
}

export function useSubscription<T>(collection: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pb.collection(collection).subscribe("*", (data) => {
      console.log(data);
      setLoading(false);
      setData(data);
    });

    return () => pb.collection(collection).unsubscribe("*");
  }, [collection]);

  return {
    data,
    loading,
  };
}

export const contactSchema = v.object({
  id: v.string(),
  name: v.string(),
  place: v.string(),
  work: v.string(),
  notes: v.string(),
  website: v.string(),

  meetings: v.array(v.string()),
  phone: v.array(v.string()),
  email: v.array(v.string()),
  // TODO: socials should be a map
  social: v.array(v.string()),
});

export function formatPhoneNumber(
  phone: number | string,
  { prefix = "+" } = {}
): string {
  return phone
    .toString()
    .replace(
      /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/g,
      `${prefix}$1\xa0$2\xa0$3-$4$5`
    );
}
