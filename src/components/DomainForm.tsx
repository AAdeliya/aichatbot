// src/components/DomainForm.tsx
"use client";

import { useDomain } from "@/hooks/use-domain";

export default function DomainForm() {
  const { register, onAddDomain, errors, loading, setIcon } = useDomain();

  return (
    <form onSubmit={onAddDomain} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Domain Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          Domain URL
        </label>
        <input
          id="url"
          {...register("url")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="icon"
          className="block text-sm font-medium text-gray-700"
        >
          Domain Icon
        </label>
        <input
          id="icon"
          type="file"
          onChange={(e) => setIcon(e.target.files?.[0] || null)}
          className="mt-1 block w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? "Adding..." : "Add Domain"}
      </button>
    </form>
  );
}
