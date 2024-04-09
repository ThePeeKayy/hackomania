'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoIosClose, IoMdSend } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/utils/supabase/client';
import Dropdown from './Dropdown';
import { createNetworkPost, getAllTags } from '@/utils/supabase/actions';
import { IoIosCloseCircleOutline } from "react-icons/io";
import toast from 'react-hot-toast';

const CreatePostModal = ({ setLoading, title, setTitle, desc, setDesc, imgUrls, setImgUrls, setCreateModal }) => {
    const [user, setUser] = useState(null)
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const supabase = supabaseBrowser()
    const router = useRouter()
    const fetchUserDeets = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data)
    }

    useEffect(() => {
        fetchUserDeets()
        const fetchingTags = async () => {
            const tagsFetched = await getAllTags()
            setTags(tagsFetched)
        }
        fetchingTags()
    }, [])

    const handleFileUpload = () => {
        const files = event.target.files;
        if (imgUrls.length > 0) {
            toast.error("You can upload up to 1 photos.");
            event.target.value = null;
        } else {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    const imageUrl = reader.result;


                    setImgUrls(imageUrl);


                };
                reader.readAsDataURL(file);
            });
        }
    };



    const fileClick = () => {
        document.getElementById("uploadFile")?.click();
    }

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
            <div onClick={() => {
                setCreateModal(false)
                setDesc('')
                setTitle('')
                setImgUrls('')
            }} className="fixed inset-0 bg-black opacity-50"></div>
            <div className="flex relative flex-col justify-between bg-white p-6 rounded-lg w-[70vw] h-[91vh] shadow-lg z-10 overflow-auto">
                <div className='flex flex-row'>
                    <div className='rounded-full w-[57px] h-[57px] overflow-hidden mt-1 ml-1'>
                        <Image alt='' src={user?.session.user.user_metadata.picture} width={57} height={57} />
                    </div>
                    <div className='flex flex-col ml-3 mt-2'>
                        <h3 className='font-bold'>{user?.session.user.user_metadata.name}</h3>
                        <p>Post to anyone</p>
                    </div>
                    <IoIosClose className='absolute right-6 top-6' size={50} onClick={() => {
                        setCreateModal(false)
                        setDesc('')
                        setTitle('')
                        setImgUrls('')
                    }} />
                </div>

                {imgUrls.length > 0 && <div className='flex items-center rounded-md p-1 my-4 ring-[1.5px] ring-inset ring-black  w-[90px] h-[100px] relative'><Image width={90} height={90} src={imgUrls} /></div>}

                <input required onChange={(e) => setTitle(e.target.value)} type='text' className='mt-2 h-[10%] border-none p-3  ' placeholder='Title' />
                <textarea required onChange={(e) => setDesc(e.target.value)} className='mt-2 min-h-[55%] border-none p-3 overflow-auto' placeholder='What do you want to talk about' />
                <div className='flex justify-between mt-4 '>
                    <ul className='flex flex-row flex-wrap'>{selectedTags.length > 0 && selectedTags.map((tag) => <li key={tag} onClick={() => setSelectedTags(selectedTags.filter((onetag) => onetag !== tag))} className='p-2 ring-1 rounded-full ring-inset ring-gray-400 shadow-md mr-5 min-w-[60px] text-center flex flex-row'>{tag}<IoIosCloseCircleOutline className='mt-1 ml-2' size={18} /></li>)}</ul>
                    <Dropdown selectedTags={selectedTags} setSelectedTags={setSelectedTags} tags={tags} />
                </div>
                <div className='justify-between flex mt-10 ml-4'>
                    <MdAddPhotoAlternate size={32} onClick={fileClick} />
                    <input id='uploadFile' type='file' className='hidden' onChange={handleFileUpload} />

                    <IoMdSend size={32} className='flex right-0' onClick={(title && desc) ? () => {
                        console.log(title, desc, imgUrls, user.session.user.id, selectedTags, user.session.user.user_metadata.picture, user.session.user.user_metadata.name)
                        createNetworkPost(title, desc, imgUrls, user.session.user.id, selectedTags, user.session.user.user_metadata.picture, user.session.user.user_metadata.name)
                        setCreateModal(false)
                        setLoading((prev) => !prev)
                        setDesc('')
                        setTitle('')
                        setImgUrls('')
                        toast.success("Post created!")
                        router.refresh()
                    } : () => toast.error('Title and description required')} />

                </div>
            </div>

        </div>
    )
}

export default CreatePostModal;
