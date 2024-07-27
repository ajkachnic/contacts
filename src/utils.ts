import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
pb.autoCancellation(false);

// TODO: use react-query or SWR
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
