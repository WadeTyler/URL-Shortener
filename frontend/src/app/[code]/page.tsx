'use client';
import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import {ShortenedURL} from "@/types/types";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Page = () => {

  const router = useRouter();

  const params = useParams<{ code: string }>();
  const code = params.code;

  const [isValidatingURL, setIsValidatingURL] = useState<boolean>(true);
  const [invalidMessage, setInvalidMessage] = useState<string>("");

  useEffect(() => {
    if (code) {
      validateURL(code);
    }

  }, [code]);

  async function validateURL(code: string) {
    try {
      setIsValidatingURL(true);
      const response = await fetch(`http://localhost:8080/api/url/validate/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setIsValidatingURL(false);

      const shortenedURL: ShortenedURL = data.data;
      router.push(shortenedURL.url);
    } catch (e) {
      setIsValidatingURL(false);
      setInvalidMessage((e as Error).message || "Failed to validate URL");
    }
  }


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-800 text-white gap-4">
      {isValidatingURL && <span className="loading loading-spinner loading-lg"></span>}
      {invalidMessage &&
        <>
          <p className="">Failed to Validate Code</p>
          {invalidMessage}
          <Link href={"/"} className="bg-blue-800 rounded px-4 py-2 hover:shadow-xl hover:bg-blue-600 duration-300">Shorten your own URL</Link>
        </>
      }
    </div>
  );
};

export default Page;
