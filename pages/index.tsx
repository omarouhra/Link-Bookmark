import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import useSWR from "swr";

export default function Home() {
  const { data, status } = useSession();

  const userId = data?.user.id;
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");

  const linkTitle = useRef(null);
  const linkUrl = useRef(null);
  const linkImage = useRef(null);
  const linkCategory = useRef(null);
  const linkDescription = useRef(null);
  // const userSearch = useRef(null);

  if (status === "unauthenticated") {
    router.push("/login");
  }

  const getLinks = async () => {
    try {
      const response = await fetch("/api/link", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  const { data: links, error } = useSWR(`/api/link`, getLinks);

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
        getLinks();
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  return (
    <div>
      <Head>
        <title>Links</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Modal showModal={showModal} setShowModal={setShowModal}>
        {/* Need to create a form component! */}
        <form
          onSubmit={event => {
            createLink(event);
          }}
          className='inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg'>
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
      </Modal>
      <div className='container mx-auto max-w-5xl my-20 flex flex-col items-start justify-center space-y-12 px-5 '>
        <div>
          {data?.user.name && (
            <p className='text-2xl font-cal'>
              Welcome{" "}
              <span className='text-blue-500'> {data?.user?.name} </span>
              <span> 👋</span>
            </p>
          )}
        </div>
        <div className='flex flex-col  justify-start space-y-8 md:space-y-0 md:flex-row  md:justify-between w-full md:items-center '>
          <div className=' relative border border-gray-200 rounded-lg flex flex-start items-center'>
            <span className='pl-5 pr-1'>🚀</span>
            <input
              className='w-full px-5 py-3 text-gray-700 bg-white focus:ring-0 focus:outline-none  rounded-none rounded-r-lg placeholder-gray-400'
              name='userName'
              required
              placeholder='Search for a user'
              onChange={e => {
                setUserSearch(e.currentTarget?.value);
              }}
              type='text'
            />
            {userSearch && (
              <div className='absolute top-14 flex flex-col opacity-90 hover:opacity-100  bg-white w-full rounded-xl overflow-hidden px-2 shadow-2xl transition duration-500'>
                {links?.map(link => (
                  <p
                    key={link.id}
                    className='border-b-2 py-3 px-2   font-cal hover:shadow-lg hover:scale-95 transition duration-200'>
                    {link.title}
                  </p>
                ))}
              </div>
            )}
          </div>
          <button
            className=' bg-gray-100 text-black hover:bg-gray-200 px-5 py-3 text-md font-cal rounded-md transition-all ease-in-out duration-150'
            onClick={() => setShowModal(true)}>
            Create Links 🔥
          </button>
        </div>
        <div>
          {!links ? (
            <div>
              <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className='bg-gray-300 w-[300px] h-[350px] rounded-md animate-pulse flex items-center justify-center'>
                  <p className='font-cal text-3xl text-gray-500'>Loading ...</p>
                </div>
                <div className='bg-gray-300 w-[300px] h-[350px] rounded-md animate-pulse flex items-center justify-center'>
                  <p className='font-cal text-3xl text-gray-500'>Loading ...</p>
                </div>
                <div className='bg-gray-300 w-[300px] h-[350px] rounded-md animate-pulse flex items-center justify-center'>
                  <p className='font-cal text-3xl text-gray-500'>Loading ...</p>
                </div>
              </ul>
            </div>
          ) : (
            <ul className='min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 '>
              {links?.map(link => (
                <Link href={link.url} key={link.id}>
                  <a>
                    <li className='shadow lg:h-full    md:max-w-md  rounded-md hover:shadow-xl transition duration-500'>
                      <img
                        className='shadow rounded-t-md min-h-[200px] w-full object-cover'
                        src={link.imageUrl}
                      />
                      <div className='p-5 flex flex-col items-start space-y-2'>
                        <p className='text-sm text-blue-500'>{link.category}</p>
                        <p className='text-lg font-cal '>{link.title}</p>
                        <p className='text-gray-600'>{link.description}</p>
                        {userId === link.userId && (
                          <img
                            alt='profile'
                            className='rounded-full w-6 h-6 ml-auto'
                            src={data.user.image}
                          />
                        )}
                      </div>
                    </li>
                  </a>
                </Link>
              ))}
            </ul>
          )}
          {links?.length === 0 && (
            <p className='font-cal text-2xl text-center w-full'>
              No links found! please create your first link 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
