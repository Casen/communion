import { redirect, type ActionFunction } from '@remix-run/node';
import { Form, Link, useSubmit, useTransition } from "@remix-run/react";
import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs'
import { useOptionalUser } from "~/utils";
import {CitySearch } from '~/components/city-search'
import { placeDetails } from '~/services/google';
import { calculateAstro } from 'lib/astro';

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData() as any

  const city = await placeDetails(form.get('id'))
  const { lat, lng, utc_offset } = city

  if (!lat || !lng || !utc_offset) {
    return {error: 'Invalid City'}
  }

  const birthDateTime = dayjs(form.get('datetime') + ':00.000Z').subtract(city.utc_offset, 'minutes')
  const timestamp = birthDateTime.toISOString()

  const astro = calculateAstro({timestamp, lat, lng})
  console.dir(astro)
  return astro
 // return redirect(`/get-birth-chart/${form.get('id')}`);
}

export default function Index() {
  const user = useOptionalUser();
  const formRef = useRef<HTMLFormElement>(null);
  const transition = useTransition()

  const [cityId, setCityId] = useState('')
  const submit = useSubmit()
  const selectCity = (city: any) => {
    setCityId(city.id)
  }

  const [selectedDate, selectDate] = useState('')
  const handleDateChange = (ev: any) => {
    if (!ev.target['validity'].valid) return;
    const dt= ev.target['value'] + ':00Z';
    console.log('got a date time: ', dt)
    selectDate(dt);
  }

  /*
  useEffect(() =>{
    if (cityId){
      submit(formRef.current, {method: 'post'})
    }
  }, [cityId, submit])
  */

  return (
    <React.Fragment>
      <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
        Enter your birth location to get started
      </p>
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
          <Link
            to="/notes"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-violet-700 shadow-sm hover:bg-violet-50 sm:px-8"
          >
            View Notes for {user.email}
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
            <CitySearch onSelect={selectCity} />
            <Form method='post' ref={formRef}> 
              <fieldset disabled={transition.state === "submitting"}>
                <input hidden={true} value={cityId} name='id' readOnly/>
                <input name="datetime" className="rounded-md w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none" type="datetime-local" onChange={handleDateChange} value={(selectedDate || '').toString().substring(0, 16)}/>
              </fieldset>
              <button className="w-full bg-violet-500 text-white font-bold my-4 py-2 px-4 rounded-md" type="submit">
                {transition.state === "submitting"
                  ? "Calculating..."
                  : "Calculate"}
              </button>
            </Form>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
