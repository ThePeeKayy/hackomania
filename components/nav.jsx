'use client'
import { TiBusinessCard } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import gov from '@/public/govtech.png'
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "../utils/supabase/client.ts";
// import { supabaseBrowser } from "@/utils/supabase/client.js";
import SearchComponent from './searchbar.jsx'

const Nav = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const supabase = supabaseBrowser();
  const [loginData, setLoginData] = useState()

  async function signInWithLinkedIn() {
    const origin = location.origin.endsWith('/') ? location.origin : location.origin + '/';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: origin
      }
    });
  }

  async function signOutFromLinkedin() {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    const getLoginData = async () => {
      const { data } = await supabase.auth.getSession();
      setLoginData(data)
      if (data.session?.user.user_metadata.name.length > 0) {
        setIsLoggedIn(true)
        // adding use to users table if not already added
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            name: data?.session.user.user_metadata.name,
            email: data?.session.user.user_metadata.email,
            image: data?.session.user.user_metadata.picture,
            id: data?.session.user.id,
          })
        })
      }
    }
    getLoginData()
    if (isLoggedIn) {
      // alert("you are logged in and data is", loginData)
    }
  }, [isLoggedIn])

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center px-2 lg:px-0">
                <Link className="flex-shrink-0" href='/'>
                  <Image
                    className="h-8 w-auto"
                    src={gov}
                    width={50}
                    height={50}
                    alt="Your Company"
                  />
                </Link>
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    <a href="/" className={`rounded-md px-3 py-2 ${pathname == '/' && 'bg-gray-900'} text-sm font-medium text-white`}>
                      Services
                    </a>
                    <a
                      href="/network"
                      className={`rounded-md px-3 py-2 ${pathname == '/network' && 'bg-gray-900'} text-sm font-medium text-white`}
                    >
                      Network
                    </a>

                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <SearchComponent />
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:block">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none "
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <TiBusinessCard size={30} />
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      {isLoggedIn ? <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {() => (
                            <a
                              href={`/profile/${loginData.session.user.id}`}
                              className={`${pathname.startsWith('/profile') && 'bg-gray-100'}
                                block px-4 py-2 text-sm text-gray-700
                              `}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${pathname.startsWith('/profile') && 'bg-gray-100'}
                                block px-4 py-2 text-sm text-gray-700
                              `}
                              onClick={signOutFromLinkedin}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items> :
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            type='button'

                            onClick={signInWithLinkedIn}
                            className='text-black pl-4'
                          ><span className='text-sm'>Sign In</span>
                          </button>
                        </Menu.Items>}
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            {loginData?.session?.user.id.length > 0 && <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                Services
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/network"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Network
              </Disclosure.Button>
            </div>}
            <div className="border-t border-gray-700 pb-3 pt-4">

              {loginData?.session?.user.id.length > 0 && <div className="flex items-center px-5">
                <div className="flex-shrink-0 rounded-full overflow-hidden">
                  <Image src={loginData?.session.user.user_metadata.picture} height={30} width={30} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{loginData?.session.user.user_metadata.name}</div>
                  <div className="text-sm font-medium text-gray-400">{loginData?.session.user.user_metadata.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              }
              <div className="mt-3 space-y-1 px-2">
                {loginData?.session?.user.id.length > 0 ?
                  <>
                    <Disclosure.Button
                      as="a"
                      // href={`/profile/${loginData.session.user.id}`} //href giving error, so im using onClick
                      onClick={() => router.push(`/profile/${loginData.session.user.id}`)}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Your Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      onClick={signOutFromLinkedin}
                    >
                      Sign out
                    </Disclosure.Button>
                  </> :
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    onClick={signInWithLinkedIn}
                  >
                    Sign In
                  </Disclosure.Button>

                }
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}


export default Nav