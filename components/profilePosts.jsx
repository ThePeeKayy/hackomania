'use client'
import React, { useEffect, useState } from 'react'
import { fetchFilteredNetworkUsingUid } from '@/utils/supabase/actions'
import Image from 'next/image'

const ProfilePosts = ({ user_id }) => {
  // fetch the posts according to user id
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const getPostsForUser = async () => {
      const fetchedPosts = await fetchFilteredNetworkUsingUid(user_id)
      setPosts(fetchedPosts)
    }
    getPostsForUser()
  }, [user_id])
  // remove the comments below after making
  return (
    <div>
      <div className="text-center mt-10">
        <h2 className="text-3xl text-black ">Your posts</h2>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {posts?.map((card) =>
          <div
            className=" relative group overflow-hidden p-8 mx-[20px] rounded-xl bg-white"
          >
            <div >
              <div aria-hidden="true" className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300   blur-2xl opacity-25 "></div>
              <div className="relative">
                <div className='flex-row flex items-center border-b-2 border-gray-300'>
                  <div className="size-12 rounded-full overflow-hidden relative">
                    <Image alt='' className="text-[#000014] left-[22%]  " fill src={card.creator_image ?? ""} ></Image>
                  </div>
                  <div className="mt-6 pb-6 rounded-b-[--card-border-radius] ml-1 ">
                    <p className="text-gray-700  font-bold">{card.creator_name}</p>
                  </div>
                </div>
                <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                  <p className="text-gray-800 font-bold text-2xl">{card.title}</p>
                </div>
                <div className='flex justify-center'>
                  {card.image && <Image alt='' width={500} height={500} src={card.image ?? ""} />}
                </div>
                <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                  <p className="text-gray-700 ">{card.description}</p>
                </div>


                <div className="flex gap-3 mt-6 -mb-8 py-4">
                  {card.tags?.length > 0 && card.tags.map((tag) =>
                    <div className="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100  text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100  flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                      <span>{tag}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>)}
        </div>
    </div>
  )
}

export default ProfilePosts