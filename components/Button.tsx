import React, { SetStateAction } from "react";
type Button = {
  label: string;
  onclick: (boolean) => void;
};

function Button({ label, onclick }: Button) {
  return (
    <button
      className=' bg-gray-100 text-black hover:bg-gray-200 px-5 py-3 text-md font-cal rounded-md transition-all ease-in-out duration-150'
      onClick={onclick}>
      {label}
    </button>
  );
}

export default Button;
