import MainPageIcon from "./MainPageIcon";
import CreateQUIZbtn from "./CreateQUIZbtn";
import PlayQUIZbtn from "./PlayQUIZbtn";
import "./MainPage.scss";

export default function MainPage() {
  return (
    <div className="row w-100 container-fluid d-flex justify-content-center">
      <div
        className="col-12 d-flex align-items-center justify-content-center"
        align="center"
      >
        <MainPageIcon />
      </div>
      <div className="col-6" align="center">
        <CreateQUIZbtn />
      </div>
      <div className="col-6" align="center">
        <PlayQUIZbtn />
      </div>
    </div>
  );
}
