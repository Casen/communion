import { useFetcher } from "@remix-run/react";
import { useMemo, useEffect } from "react";
import debounce from 'lodash.debounce'
import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

interface City {
  id: string
  description: string
}

interface CitySearchProps {
  onSelect: (city: City) => void
}

export function CitySearch(props: CitySearchProps) {
  //const [selected, selectCity] = useState<City>({id: '', description: ''})
  const [query, setQuery] = useState('')

  const cities = useFetcher()

  const search = (event: any) => {
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
    <div className="">
      <cities.Form method="get" action="/api/cities" autoComplete="off" role="presentation">
      <Combobox onChange={props.onSelect}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left shadow-md  sm:text-sm focus-within:ring-4">
            <Combobox.Input
              name = "q"
              placeholder="Los Angeles"
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
              displayValue={(city: City) => city ? `${city.description}` : ''}
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
              {(cities.data && cities.data.error) ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Something went wrong
                </div>
              ) : null }
              {cities.data ? cities.data.map((city: City) => (
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
                          {`${city?.description}`}
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
              : null}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </cities.Form>
    </div>
  )
}