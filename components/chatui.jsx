'use client'
import React, { useEffect, useState } from 'react';
import { IoMdSend } from "react-icons/io";
import Image from 'next/image';
import { getChats, saveChat } from '@/utils/supabase/actions';
import { supabaseBrowser } from '@/utils/supabase/client';
import { IoIosCloseCircle } from "react-icons/io";

function ChatPage({ setChatOpen }) {
  const [dbchathistory, setdbchathistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(null);
  const [finalMessageList, setFinalMesssageList] = useState('');
  const [userID, setUserID] = useState('')
  const supabase = supabaseBrowser()
  useEffect(() => {
    const fetchUserID = async () => {
      const { data } = await supabase.auth.getSession();
      setUserID(data?.session?.user.id)
    }
    const fetchChatHistory = async (userid) => {
      const response = await getChats(userid)
      const chathistory = response?.[0].messages
      setdbchathistory(chathistory)
    }
    fetchUserID()
    fetchChatHistory(userID)
  }, [])
  let sendMessage = []
  const handleSendMessage = async (inputValue) => {
    if (!messages) {
      sendMessage = [{
        "role": "system", "content": "You are a chatbot for the Singapore Government that answers the questions accurately and succinctly to help businesses with their problems. Instructions: - Only answer questions about Singapore government. - If you are unsure about the question, then reply with 'I am not sure'. Context: - In the services page of our website, it has info about govt services. - In the network page, we can connect with other Singapore businesses."
      }, { 'role': 'user', 'content': inputValue }]
    }
    if (messages) {
      sendMessage = [...messages, { 'role': 'user', 'content': inputValue }]
    }
    setInputValue('')
    setMessages(sendMessage)
    try {
      // const response = await fetch('http://127.0.0.1:8080/chatbot', {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     messages: sendMessage
      //   })


      // })
      // const finalresponse = await response.json()
      const finalresponse = {conversations:'Test Message'}
      setMessages(finalresponse.conversations)
      if (messages?.length > 0 && dbchathistory?.length > 0) { setFinalMesssageList([...dbchathistory, ...messages.slice(1)]) } else if (dbchathistory?.length && messages?.length == 0) {
        setFinalMesssageList(dbchathistory)
      } else if (dbchathistory?.length == 0 && messages?.length) { setFinalMesssageList(messages) }
    } catch (error) {

    }
    setLoading((prev) => !prev)

  };
  useEffect(() => {
    let messagesquare = document.getElementById("messagesquare")
    messagesquare.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [loading])
  return (
    <div className="max-w-[300px] min-w-[300px]">
      <div className='ring-2 flex flex-row justify-between px-4 items-center ring-gray-300 w-[350px] bg-white rounded-t-lg h-[55px]'>
        <div className='flex flex-row'>
          <Image width={30} height={30} src='/bot.png' />
          <p className='ml-2 font-bold mt-[2px] '>AskUs</p>
        </div>
        <IoIosCloseCircle onClick={() => setChatOpen(false)} size={30} />
      </div>
      <div className="p-4 bg-white ring-2 ring-gray-300 overflow-auto h-[40vh] w-[350px]">

        <div id="messagesquare" className='space-y-4 w-auto flex flex-col'>
          {messages?.length > 0 && messages?.slice(1).map((message, index) => (
            <div key={index} className={`${message.role == 'user' ? 'justify-end' : 'justify-start'} ${message.content == "user" && "hidden"} p-2 px-4 rounded-md flex `}>
              {message.role !== 'user' && <Image width={30} height={30} className='rounded-small overflow-hidden min-w-[30px] max-h-[30px]' src='/bot.png' />}
              <span className={`${message.role == 'user' ? 'bg-gray-200' : 'bg-gray-300'} rounded-md ml-2 px-4 p-2`}>{message.content}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row chat-input w-[350px] relative">
        <input
          type="text"
          name="text"
          value={inputValue}
          autoComplete='off'
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          id="text"
          className="pr-16 block w-[350px] rounded-b-lg border-0 px-4 py-4 text-gray-900 shadow-sm ring-2 ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
          placeholder="Type here..."
        />
        <IoMdSend className='absolute right-1 top-3' onClick={() => handleSendMessage(inputValue)} size={35} />
      </div>
    </div>
  );
}

export default ChatPage;