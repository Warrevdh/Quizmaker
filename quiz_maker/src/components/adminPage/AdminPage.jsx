import AdminPageHeader from "./AdminPageHeader";
import AdminPageContent from "./AdminPageContent";
import "./AdminPage.scss";

export default function AdminPage() {
  return (
    <div className="container-fluid d-flex adminpanel_bg">
      <AdminPageHeader />
      <AdminPageContent />
    </div>
  );
}
