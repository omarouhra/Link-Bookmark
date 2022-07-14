import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function Home() {
  const { data, status } = useSession();

  const userId = data?.user.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  console.log(userId);
  console.log(links);
  if (status === "unauthenticated") {
    router.push("/login");
  }

  const getLinks = async () => {
    try {
      const response = await fetch("/api/link", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      setLinks(await response.json());
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  const createLink = async () => {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "Open Source",
          description: "Fullstack React framework",
          imageUrl: "https://nextjs.org/static/twitter-cards/home.jpg",
          title: "Next.js",
          url: "https://nextjs.org",
          userId: userId,
        }),
      });
    } catch (error) {
      console.log("there was an error submitting", error);
    }
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div>
      <Head>
        <title>Links</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Modal showModal={showModal} setShowModal={setShowModal}>
        <form
          onSubmit={event => {
            // event.preventDefault();
            // setCreatingSite(true);
            // createSite(event);
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
                // ref={siteNameRef}
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
                // ref={siteNameRef}
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
                // ref={siteNameRef}
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
                // ref={siteNameRef}
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
                // ref={siteNameRef}
                type='text'
              />
            </div>

            {/* {error && (
              <p className='px-5 text-left text-red-500'>
                <b>{error}</b> is not available. Please choose another
                subdomain.
              </p>
            )} */}
          </div>
          <div className='flex justify-between items-center mt-10 w-full'>
            <button
              type='button'
              className='w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150'
              onClick={() => {
                // setError(null);
                setShowModal(false);
              }}>
              CANCEL
            </button>

            <button
              type='submit'
              // disabled={creatingSite || error !== null}
              // onClick={() => router.push("/editor")}
              className=' bg-white text-gray-600 hover:text-black w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150'>
              CREATE LINK
            </button>
          </div>
        </form>
      </Modal>

      <div className='container mx-auto max-w-5xl my-20 flex flex-col items-start justify-center space-y-12 '>
        <button
          className=' bg-gray-100 text-black  hover:shadow-xl px-5 py-5 text-lg font-cal rounded-md transition-all ease-in-out duration-150'
          onClick={() => setShowModal(true)}>
          create links 🚀
        </button>

        <div>
          {status === "loading" ? (
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
              <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
              <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
              <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
            </ul>
          ) : (
            <div>
              <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                {links?.map(link => (
                  <Link href={link.url} key={link.id}>
                    <a>
                      <li className='shadow lg:h-full  max-w-md  rounded-md hover:shadow-xl transition duration-500'>
                        <img
                          className='shadow rounded-t-md min-h-[200px] w-full object-cover'
                          src={link.imageUrl}
                        />
                        <div className='p-5 flex flex-col items-start space-y-2'>
                          <p className='text-sm text-blue-500'>
                            {link.category}
                          </p>
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

              {/* <p className='font-cal text-2xl text-center w-full'>
                  No links found! please create your first link 🚀
                </p> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
