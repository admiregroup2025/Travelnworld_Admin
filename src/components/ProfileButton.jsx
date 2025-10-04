import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileButton = () => {
  return (
   <div className="flex items-center gap-2 cursor-pointer">
  <div className="rounded-full p-5 w-8 h-8 flex items-center justify-center bg-[linear-gradient(45deg,var(--primary-color),var(--secondary-color))]">
    <FaUser className="text-white  absolute" />
  </div>
  <div>
    <h2>Admin User</h2>
    <p>Administrator</p>
  </div>
</div>

  );
};

export default ProfileButton;
// linear-gradient(45deg, var(--primary-color), var(--secondary-color));