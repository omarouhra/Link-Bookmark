import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, status } = useSession();

  const userId = data?.user.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);

  console.log(userId);
  console.log(links);
  if (status === "unauthenticated") {
    router.push("/login");
  }

  const getLinks = async () => {
    try {
      const response = await fetch("/api/links", {
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
          id: "8a9020b2-363b-4a4f-ad26-d6d55b51bqes",
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

      <div className='container mx-auto max-w-5xl my-20 flex items-center justify-center '>
        {/* <button onClick={() => createLink()}>create links</button> */}

        <div>
          {status === "loading" ? (
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
              <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
              <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
              <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
            </ul>
          ) : (
            <div>
              {links.length ? (
                <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                  {links?.map(link => (
                    <Link href={link.url} key={link.id}>
                      <a>
                        <li className='shadow lg:h-full  max-w-md  rounded-md hover:shadow-xl transition duration-500'>
                          <img
                            className='shadow rounded-t-md h-1/2 w-full object-cover'
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
              ) : (
                <p className='font-cal text-2xl text-center w-full'>
                  No links found! please create your first link 🚀
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
