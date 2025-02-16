'use client';
import React, {SetStateAction, useState} from "react";
import {ShortenedURL} from "@/types/types";
import Link from "next/link";


export default function Home() {


  const [shortenedURL, setShortenedURL] = useState<ShortenedURL | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>("")

  const handleCopy = async (url: string) => {
    try {
      if (!url) return;
      await navigator.clipboard.writeText(url);
      setCopySuccess("URL Copied!");
    } catch (e) {
      setCopySuccess('Failed to copy URL: ' + e);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">

      <h1 className="text-2xl font-semibold">Wade&#39;s URL Shortener</h1>
      <p className="italic">Simple, Fast, Reliable</p>

      <hr className="border w-96"/>

      {!shortenedURL && <ShortenURLForm setShortenedURL={setShortenedURL}/>}
      {shortenedURL && (
        <div className="flex flex-col gap-4 items-center w-96">
          <p>URL Successfully Shortened:</p>
          <div className="flex items-center gap-4 justify-between w-full">
            <Link href={`http://localhost:3000/${shortenedURL.code}`} target="_blank" className="text-blue-800">
              http://localhost:3000/{shortenedURL.code}
            </Link>
            <section className="flex flex-col gap-2">
              <button
                className="rounded px-4 py-2 bg-blue-800 text-white hover:bg-blue-600 duration-300 hover:shadow-xl"
                onClick={() => handleCopy(`http://localhost:3000/${shortenedURL.code}`)}
              >
                Copy
              </button>
              {copySuccess && <p className="text-blue-800">{copySuccess}</p>}
            </section>
          </div>

          <button
            className="rounded bg-blue-800 text-white hover:bg-blue-600 w-full px-4 py-2 duration-300 hover:shadow-xl"
            onClick={() => setShortenedURL(null)}
          >
            Shorten another URL
          </button>
        </div>
      )}

    </div>
  );
}

const ShortenURLForm = ({setShortenedURL}: {
  setShortenedURL: React.Dispatch<SetStateAction<ShortenedURL | null>>;
}) => {

  // States
  const [url, setUrl] = useState<string>("");
  const [expiration, setExpiration] = useState<string>("7");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Functions
  async function handleSubmit() {
    try {
      if (isSubmitting || !url || !expiration) return;

      setSubmitError("");
      setIsSubmitting(true);

      const date = new Date();
      date.setDate(date.getDate() + parseInt(expiration));

      const expires = date.toISOString().slice(0, 10);

      const response = await fetch('http://localhost:8080/api/url/shorten', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          expires
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || "Failed to Shorten URL");
        setIsSubmitting(false);
        return;
      }

      setShortenedURL(data.data);
      setIsSubmitting(false);
    } catch (e) {
      setIsSubmitting(false);
      setSubmitError((e as Error).message || "Failed to Shorten URL");
    }
  }

  return (
    <form className="w-96 flex flex-col gap-4" onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <div className="flex flex-col">
        <p className="font-bold text-sm">URL</p>
        <input
          type="text"
          className="max-w-96 p-2 rounded hover:shadow-xl focus:shadow-xl focus:font-semibold placeholder:text-zinc-500 text-background focus:outline-none focus:bg-zinc-400 duration-300 bg-zinc-800"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={"URL - Ex: https://google.com"}
        />
      </div>
      <div className="flex flex-col">
        <p className="font-bold text-sm">EXPIRATION</p>
        <select
          className="max-w-96 p-2 rounded hover:shadow-xl focus:shadow-xl focus:font-semibold placeholder:text-zinc-500 text-background focus:outline-none focus:bg-zinc-400 duration-300 bg-zinc-800"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
        >
          <option value={1}>1 Day</option>
          <option value={3}>3 Days</option>
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
        </select>
      </div>

      <button
        className="w-full bg-zinc-800 hover:bg-zinc-400 px-4 py-2 font-semibold text-xl rounded text-white duration-300">Shorten
        URL
      </button>

      {submitError && <p className="text-red-800 font-semibold">{submitError}</p>}

    </form>
  )
}
