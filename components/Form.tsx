import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useRef } from "react";
import useSWR, { useSWRConfig } from "swr";

type FormType = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

function Form({ setShowModal }: FormType) {
  const { mutate } = useSWRConfig();

  // Session Data
  const { data: session } = useSession();
  /* @ts-ignore */
  const userId = session?.user?.id;

  // Form refs
  const linkTitle = useRef(null);
  const linkUrl = useRef(null);
  const linkImage = useRef(null);
  const linkCategory = useRef(null);
  const linkDescription = useRef(null);

  const createLink = async event => {
    event.preventDefault();

    try {
      const responce = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: linkTitle.current?.value,
          imageUrl: linkImage.current?.value,
          url: linkUrl.current?.value,
          category: linkCategory.current?.value,
          description: linkDescription.current?.value,
          userId: userId,
        }),
      });
      if (responce.ok) {
        mutate("/api/link");
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };
  return (
    <form
      onSubmit={event => {
        createLink(event);
      }}>
      <h2 className='font-cal text-2xl mb-6'>Create a New Link</h2>
      <div className='grid gap-y-5 w-5/6 mx-auto'>
        <div className='border border-gray-700 rounded-lg flex flex-start items-center'>
          <span className='pl-5 pr-1'>📌</span>
          <input
            className='w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400'
            name='name'
            required
            placeholder='Site Name'
            ref={linkTitle}
            type='text'
          />
        </div>
        <div className='border border-gray-700 rounded-lg flex flex-start items-center'>
          <span className='pl-5 pr-1'>🪧</span>
          <input
            className='w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400'
            name='Url'
            required
            placeholder='Url'
            ref={linkUrl}
            type='url'
          />
        </div>
        <div className='border border-gray-700 rounded-lg flex flex-start items-center'>
          <span className='pl-5 pr-1'>🖼️</span>
          <input
            className='w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400'
            name='image'
            required
            placeholder='Image'
            ref={linkImage}
            type='url'
          />
        </div>
        <div className='border border-gray-700 rounded-lg flex flex-start items-center'>
          <span className='pl-5 pr-1'>⭐</span>
          <input
            className='w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400'
            name='Category'
            required
            placeholder='Category'
            ref={linkCategory}
            type='text'
          />
        </div>
        <div className='border border-gray-700 rounded-lg flex flex-start items-center'>
          <span className='pl-5 pr-1'>🖊️</span>
          <input
            className='w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400'
            name='Description'
            required
            placeholder='Description'
            ref={linkDescription}
            type='text'
          />
        </div>
      </div>
      <div className='flex justify-between items-center mt-10 w-full'>
        <button
          type='button'
          className='w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl  focus:outline-none focus:ring-0 transition-all ease-in-out duration-150'
          onClick={() => {
            // setError(null);
            setShowModal(false);
          }}>
          CANCEL
        </button>

        <button
          type='submit'
          // disabled={creatingSite || error !== null}
          onClick={() => setShowModal(false)}
          className=' bg-white text-gray-600 hover:text-black w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150'>
          CREATE LINK
        </button>
      </div>
    </form>
  );
}

export default Form;
