import { redirect, type ActionFunction } from '@remix-run/node';
import { Form, Link, Outlet, useSubmit } from "@remix-run/react";
import { useState, useEffect, useRef } from 'react';
import { useOptionalUser } from "~/utils";
import {CitySearch } from '~/components/city-search'

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData() as any
  return redirect(`/get-birth-chart/${form.get('id')}`);
}

export default function Index() {
  const user = useOptionalUser();
  const formRef = useRef<HTMLFormElement>(null);

  const [cityId, setCityId] = useState('')
  const submit = useSubmit()
  const selectCity = (city: any) => {
    setCityId(city.id)
  }

  useEffect(() =>{
    if (cityId){
      submit(formRef.current, {method: 'post'})
    }
  }, [cityId, submit])

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://user-images.githubusercontent.com/8431042/161311608-f5d43ab2-85b4-40c5-9dea-065985e5adf5.jpeg"
                alt="BTS playing on stage with the group leaving in action poses"
              />
              <div className="absolute inset-0 bg-[color:rgba(139,92,246,0.5)] mix-blend-multiply" />
            </div>
            <div className="lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-violet-500 drop-shadow-md">
                  Get your Birth Chart
                </span>
              </h1>
              <Outlet/>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {[
              {
                src: "https://user-images.githubusercontent.com/8431042/161311102-fad29f2b-ffd4-4a24-aa4e-92f3fda526a7.svg",
                alt: "Netlify",
                href: "https://netlify.com",
              },
              {
                src: "https://user-images.githubusercontent.com/8431042/158711352-746c52cf-433e-4823-987a-c9d6f4349ce7.svg",
                alt: "Supabase",
                href: "https://supabase.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
                alt: "Tailwind",
                href: "https://tailwindcss.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                alt: "Cypress",
                href: "https://www.cypress.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org",
              },
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <img alt={img.alt} src={img.src} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}