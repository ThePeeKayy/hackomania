'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { supabaseBrowser } from '@/utils/supabase/client'
import { getNetworkCards } from '@/utils/supabase/actions'

const NetworkCards = ({ loading, setCreateModal }) => {
  const supabase = supabaseBrowser()
  const [user, setUser] = useState(null)
  const [cards, setCards] = useState([])
  const [animationID, setAnimationID] = useState('')
  //   const animate = searchParams?.animate || ''
  useEffect(() => {
    const fetchCards = async () => {
      const fetchNetworkCards = await getNetworkCards()
      setCards(fetchNetworkCards)
    }
    fetchCards()
    fetchUserDeets()
  }, [loading])


  const fetchUserDeets = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data)
  }

  //   useEffect(() => {
  //     setAnimationID(animate)
  //     setTimeout(() => {
  //       setAnimationID('')
  //       const params = new URLSearchParams(searchParams)
  //       params.delete('animate')
  //     }, 500)
  //   }, [animate])
  return (
    <div className=''>
      <section>
        <div className="">
          <div className=" w-full flex justify-center px-6 text-gray-500">
            <div className="mt-12 flex flex-col w-[40vw] gap-3">
              {user && <div className=" relative group overflow-hidden py-8 px-4 rounded-xl bg-white border border-gray-200">
                <div>
                  <div className="relative mr-2">
                    <div className="flex flex-row space-x-2 rounded-b-[--card-border-radius]">
                      <Image className='rounded-full overflow-hidden' src={user?.session?.user?.user_metadata.picture} height={47} width={47} alt='' />
                      <button onClick={() => setCreateModal(true)} className='rounded-full flex justify-start w-full py-2 px-4 ring-1 ring-inset ring-gray-300 bg-gray-100'>Create Post...</button>
                    </div>
                  </div>
                </div>
              </div>}

              {cards?.map((card) =>
                <div

                  key={card.html_id}
                  id={card.html_id}
                  className=" relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 "
                >
                  <div >
                    <div className="relative">
                      <div className='flex-row flex items-center border-b-2 border-gray-300'>
                        <div className="size-12 rounded-full overflow-hidden relative">
                          <Image alt='' className="text-[#000014] left-[22%]  " fill src={card.creator_image} ></Image>
                        </div>
                        <div className="mt-6 pb-6 rounded-b-[--card-border-radius] ml-1 ">
                          <p className="text-gray-700  font-bold">{card.creator_name}</p>
                        </div>
                      </div>
                      <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                        <p className="text-gray-800 font-bold text-2xl ">{card.title}</p>
                      </div>
                      <div className='flex justify-center'>
                        {card.image && <Image alt='' width={500} height={500} src={card.image || ''} />}
                      </div>
                      <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                        <p className="text-gray-700 ">{card.description}</p>
                      </div>


                      <div className="flex gap-3 mt-6 -mb-8 py-4">
                        {card.tags?.length > 0 && card.tags.map((tag) =>
                          <div className="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100   text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100  flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                            <span>{tag}</span>

                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NetworkCards;