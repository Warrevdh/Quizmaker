import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useUsers from "../../api/users";

export default function ProfileHeader() {
  const { user } = useAuth0();
  const userAPI = useUsers();

  useEffect(() => {
    const onPageLoad = () => {
      const checkAdmin = async () => {
        try {
          if (await userAPI.checkIfAdmin(user.email, user.nickname))
            document.getElementById("adminLink").hidden = false;
        } catch (error) {}
      };
      checkAdmin();
    };

    if (document.readyState === "complete" && user.sub !== undefined) {
      onPageLoad();
    }
  });

  return (
    <div className="profile_header">
      <Link to="/">
        <div className="backBtn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8L8 12L12 16"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 12H8"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="text">back</div>
        </div>
      </Link>
      <div className="ProfileIcon">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.54696 0C5.54602 0.00207137 3.62762 0.797722 2.21274 2.21236C0.797861 3.62699 0.00207173 5.54505 0 7.54564V22.4491C0.00137996 24.4504 0.796781 26.3694 2.21166 27.785C3.62654 29.2007 5.54532 29.9972 7.54696 30H22.453C24.4543 29.9959 26.3722 29.1988 27.7868 27.7835C29.2014 26.3682 29.9972 24.45 30 22.4491V7.54564C29.9979 5.54505 29.2021 3.62699 27.7873 2.21236C26.3724 0.797722 24.454 0.00207137 22.453 0H7.54696ZM7.54696 1.30412H22.453C24.1087 1.3055 25.6963 1.96336 26.8676 3.13343C28.0388 4.30349 28.6981 5.89023 28.7009 7.54564V22.4491C28.6993 23.3032 28.5215 24.1478 28.1786 24.9301C27.8357 25.7123 27.335 26.4154 26.7078 26.9953C25.1087 21.8805 20.3113 18.242 14.8774 18.242C12.2579 18.2381 9.70504 19.0675 7.58812 20.6101C5.47121 22.1527 3.89999 24.3287 3.10174 26.8232C1.95009 25.6586 1.30424 24.0869 1.30435 22.4491V7.54564C1.30573 5.89071 1.96387 4.30396 3.13429 3.13375C4.30471 1.96353 5.89174 1.3055 7.54696 1.30412ZM14.9583 5.28691C13.4084 5.28828 11.9224 5.90411 10.826 6.99933C9.72958 8.09456 9.11233 9.5798 9.10957 11.1294C9.11163 12.6799 9.72842 14.1663 10.8247 15.2629C11.9211 16.3596 13.4075 16.9769 14.9583 16.9797C16.4785 16.9342 17.9213 16.2985 18.9805 15.2073C20.0398 14.1161 20.6323 12.6552 20.6323 11.1346C20.6323 9.61392 20.0398 8.15307 18.9805 7.06186C17.9213 5.97065 16.4785 5.33493 14.9583 5.28951V5.28691ZM14.9583 6.59103C16.1443 6.61945 17.2722 7.11048 18.101 7.95922C18.9298 8.80796 19.3937 9.9471 19.3937 11.1333C19.3937 12.3195 18.9298 13.4586 18.101 14.3073C17.2722 15.1561 16.1443 15.6471 14.9583 15.6755C12.4539 15.6755 10.4139 13.6359 10.4139 11.132C10.4139 8.62806 12.4539 6.59364 14.9583 6.59364V6.59103ZM14.88 19.5462C19.8965 19.5462 24.3157 22.9995 25.6017 27.8091C24.673 28.3568 23.6087 28.6959 22.4583 28.6959H7.54696V28.6907C6.30783 28.6907 5.15478 28.3177 4.18174 27.6917C4.82234 25.348 6.2169 23.2804 8.15003 21.8081C10.0832 20.3359 12.4473 19.541 14.8774 19.5462H14.88Z"
            fill="#231F20"
          />
        </svg>
      </div>
      <div id="adminLink" hidden>
        <Link className="adminLink" to="/admin">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.48 2.66663H21.52L29.3333 10.48V21.52L21.52 29.3333H10.48L2.66667 21.52V10.48L10.48 2.66663Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 10.6666V16"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 21.3334H16.0134"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
