import Head from "next/head";
import { links } from "../data/links";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useState } from "react";

export default function Home() {
  const { data, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/login");
  }
  return (
    <div>
      <Head>
        <title>Links</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='container mx-auto max-w-5xl my-20 flex items-center justify-center '>
        {status === "loading" ? (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
            <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
            <div className='bg-gray-300 w-[300px] h-[300px] rounded-md animate-pulse'></div>
          </ul>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            {links.map(link => (
              <Link href={link.url} key={link.id}>
                <a>
                  <li className='shadow lg:h-full  max-w-md  rounded-md hover:shadow-xl transition duration-500'>
                    <img
                      className='shadow rounded-t-md h-1/2 w-full object-cover'
                      src={link.imageUrl}
                    />
                    <div className='p-5 flex flex-col space-y-2'>
                      <p className='text-sm text-blue-500'>{link.category}</p>
                      <p className='text-lg font-cal '>{link.title}</p>
                      <p className='text-gray-600'>{link.description}</p>
                    </div>
                  </li>
                </a>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
