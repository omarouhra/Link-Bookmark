import React from "react";
import Link from "next/link";

function BookmarkedLink({ link }: any) {
  return (
    <Link href={link.url} key={link.id}>
      <a>
        <li className='shadow lg:h-full animate-fade-in-up    md:max-w-md  rounded-md hover:shadow-xl transition duration-500'>
          <img
            className='shadow rounded-t-md h-[200px] w-full object-cover'
            src={link.imageUrl}
          />
          <div className='p-5 flex flex-col items-start space-y-2'>
            <p className='text-sm text-blue-500'>{link.category}</p>
            <p className='text-lg font-cal '>{link.title}</p>
            <p className='text-gray-600'>{link.description}</p>
          </div>
        </li>
      </a>
    </Link>
  );
}

export default BookmarkedLink;
