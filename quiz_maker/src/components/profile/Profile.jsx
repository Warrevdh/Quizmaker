import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import "./Profile.scss";
export default function Profile() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center profile_bg">
      <ProfileHeader />
      <ProfileForm />
    </div>
  );
}
