import Head from "next/head";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Modal from "../components/Modal";
import useSWR from "swr";
import Button from "../components/Button";
import Form from "../components/Form";
import BookmarkedLink from "../components/BookmarkedLink";
import useRequireAuth from "../lib/useRequiredAuth";

export default function Home() {
  // Session Data
  const { data: session, status } = useSession();
  const user = session?.user;
  /* @ts-ignore */
  const userId = user?.id;

  useRequireAuth();

  // App States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");
  const [userSearchLinks, setUserSearchLinks] = useState<any>([]);
  const [pagination, setPagination] = useState<number>(3);

  // Async functions
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

  const getUsers = async () => {
    try {
      const response = await fetch("/api/user", {
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

  const getUsersSearchLinks = async (id: string) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (response.ok) {
        const links = await response.json();
        setUserSearchLinks(links);
      }
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  // SWR
  const { data: links } = useSWR(`/api/link`, getLinks);
  const { data: users } = useSWR(`/api/user`, getUsers);

  const searchUsers = users?.filter(
    user =>
      user.id != userId &&
      user.name.toLowerCase().startsWith(userSearch.toLowerCase())
  );

  return (
    <div>
      <Head>
        <title>Links</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className='inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg'>
          <Form  setShowModal={setShowModal} />
        </div>
      </Modal>

      <div className='container mx-auto max-w-5xl my-20 flex flex-col items-start justify-center space-y-12 px-5 '>
        <div>
          {user?.name && (
            <p className='text-2xl font-cal'>
              Welcome <span className='text-blue-500'> {user?.name} </span>
              <span> 👋</span>
            </p>
          )}
        </div>
        <div className='flex flex-col  justify-start space-y-8 md:space-y-0 md:flex-row  md:justify-between w-full md:items-center '>
          <div className=' relative border border-gray-200 rounded-lg flex flex-start items-center'>
            <span className='pl-5 pr-1'>🔍</span>
            <input
              className='w-full px-5 py-3 text-gray-700 bg-white focus:ring-0 focus:outline-none  rounded-none rounded-r-lg placeholder-gray-400'
              name='userName'
              required
              placeholder='Github Username...'
              value={userSearch}
              onChange={e => {
                setUserSearch(e.currentTarget?.value);
              }}
              type='text'
            />
            {userSearch.length != 0 && (
              <div className='absolute mt-1 top-full flex flex-col opacity-90 hover:opacity-100  bg-white w-full rounded-xl overflow-hidden  shadow-2xl transition duration-500 '>
                {searchUsers.length ? (
                  searchUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setUserSearch("");
                        getUsersSearchLinks(user.id);
                      }}
                      className='border-b-2 py-3 bg-white px-2 text-left  font-cal hover:shadow-lg transition duration-200'>
                      {user.name}
                    </button>
                  ))
                ) : (
                  <p className='border-b-2 py-3 bg-white px-2  font-cal hover:shadow-lg transition duration-200'>
                    No user founded 🥺
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            label={
              userSearchLinks.length != 0 ? "Your Links ➡️" : "Create Links 🔥"
            }
            onclick={() => {
              userSearchLinks.length != 0
                ? setUserSearchLinks([])
                : setShowModal(true);
            }}
          />
        </div>
        <div className='w-full h-[50vh] '>
          {!links || !userSearchLinks ? (
            <div>
              <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className='bg-gray-300 min-w-full md:w-[300px] h-[350px] rounded-md animate-pulse flex items-center justify-center'>
                  <p className='font-cal text-3xl text-gray-500'>Loading ...</p>
                </div>
                <div className='bg-gray-300 min-w-full md:w-[300px] h-[350px] rounded-md animate-pulse flex items-center justify-center'>
                  <p className='font-cal text-3xl text-gray-500'>Loading ...</p>
                </div>
                <div className='bg-gray-300 min-w-full md:w-[300px] h-[350px] rounded-md animate-pulse flex items-center justify-center'>
                  <p className='font-cal text-3xl text-gray-500'>Loading ...</p>
                </div>
              </ul>
            </div>
          ) : (
            <div>
              {userSearchLinks?.name && (
                <div className='mb-8'>
                  <p className='font-cal text-xl mb-2'>
                    {" "}
                    <span className='text-blue-500'>
                      {userSearchLinks?.name.toUpperCase()}{" "}
                    </span>
                    Links
                  </p>

                  {/* <p className='font-cal text-gray-600 '>
                    If you like any links you can add them by click on 🚀 Button{" "}
                  </p> */}
                </div>
              )}
              {userSearchLinks.length === 0 ? (
                <ul className='min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 '>
                  {links?.slice(0, pagination).map(link => (
                    <BookmarkedLink link={link} />
                  ))}
                </ul>
              ) : (
                <ul className='min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 '>
                  {userSearchLinks?.bookmarks
                    ?.slice(0, pagination)
                    .map(link => (
                      <BookmarkedLink link={link} />
                    ))}
                </ul>
              )}
            </div>
          )}

          {((links && pagination < links?.length) ||
            (userSearchLinks && pagination < userSearchLinks?.length)) && (
            <div className='w-full flex items-center justify-center py-12'>
              <Button
                label='Load More ⭐'
                onclick={() => setPagination(pagination + 3)}
              />
            </div>
          )}
          {links?.length === 0 && userSearchLinks.length === 0 && (
            <p className='font-cal text-2xl text-center w-full'>
              No links found! please create your first link 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
