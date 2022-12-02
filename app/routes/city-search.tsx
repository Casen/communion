import { useFetcher } from "@remix-run/react";
import { useMemo, useEffect } from "react";
import debounce from 'lodash.debounce'
import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

interface City {
  id: string
  name: string
  regionCode: string
  countryCode: string
}


export default function CitySearch() {
  const [selected, selectCity] = useState<City>()
  const [query, setQuery] = useState('')

  const cities = useFetcher()

  const search = (event: any) => {
    console.log('searching cities')
    cities.submit(event.target.form)
  }

  const debouncedSearch = useMemo(
    () => debounce(search, 300)
  , []);

  // Stop the invocation of the debounced function
  // after unmounting
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    }
  });



  return (
    <div className="fixed top-16 w-72">
      <cities.Form method="get" action="/api/cities" autoComplete="off" role="presentation">
      <Combobox value={selected} onChange={selectCity}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              name = "q"
              placeholder="Los Angeles"
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(city: City) => city ? `${city?.name}, ${city?.regionCode}, ${city?.countryCode}` : ''}
              onChange={debouncedSearch}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {(!cities.data || cities.data?.length === 0) && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : null }
              {(cities.state === "submitting") ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Loading...
                </div>
              ) : null }
              {(cities.data || []).map((city: City) => (
                  <Combobox.Option
                    key={city.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={city}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {`${city?.name}, ${city?.regionCode}, ${city?.countryCode}`}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              }
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </cities.Form>
    </div>
  )
}