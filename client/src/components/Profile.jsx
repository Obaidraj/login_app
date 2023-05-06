import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helper/helper";
const Profile = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const [file, setFile] = useState("");
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      email: apiData?.email || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {
        profile: file || apiData?.profile || "",
      });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>,
      });
    },
  });
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };
  // logout handler function
  function userLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen ">
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%", paddingTop: "3rem" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update your profile.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || apiData?.profile || avatar}
                  alt="avatar"
                  className={`${styles.profile_img} ${extend.profile_img}`}
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input
                  type="text"
                  placeholder="First Name*"
                  className={`${styles.textbox} ${extend.textbox}`}
                  {...formik.getFieldProps("firstName")}
                />{" "}
                <input
                  type="text"
                  placeholder="Last Name*"
                  className={`${styles.textbox} ${extend.textbox}`}
                  {...formik.getFieldProps("lastName")}
                />
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className={`${styles.textbox} ${extend.textbox}`}
                  {...formik.getFieldProps("mobile")}
                />{" "}
                <input
                  type="text"
                  placeholder="E-mail*"
                  className={`${styles.textbox} ${extend.textbox}`}
                  {...formik.getFieldProps("email")}
                />{" "}
              </div>
              <input
                type="text"
                placeholder="Address"
                className={`${styles.textbox} ${extend.textbox}`}
                {...formik.getFieldProps("address")}
              />{" "}
              <button type="submit" className={styles.btn}>
                Update
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                come back later?{" "}
                <button onClick={userLogout} className="text-red-500" to="/">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
