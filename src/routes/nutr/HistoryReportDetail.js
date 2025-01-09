import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import "../../App.css";
import "../../components/report.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReadMore from "../../components/Readmore";

const optionsDMY = {
  timeZone: "Asia/Bangkok", // แก้ไข timezone
  year: "numeric",
  month: "long",
  day: "numeric",
};

const calculateTimeAgo = (createdAt) => {
  const currentTime = new Date();
  const postTime = new Date(createdAt);
  const timeDiff = Math.abs(currentTime - postTime) / 36e5; // คำนวณต่างเป็นชั่วโมง

  if (timeDiff < 1) {
    return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
  } else if (timeDiff < 24) {
    return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
  } else {
    return postTime.toLocaleString("th-TH", optionsDMY);
  }
};

function ReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData } = location.state || {}; // ดึงค่าจาก state

  return (
    <>
      <div className="container">
        <Navbar />
        <div className="sidebar-content-wrapper">
          <SideBar />
          <div className="content-rp">
            <div className="report-render">
            <button className="btn-goback" onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-angle-left"></i>
                  </button>
              <div className="report-card">
                <div className="report-info">
                  <h3>[รายงาน] เกร็ดความรู้ | {reportData.triviaDetails.head}</h3>
                  <h4>สถานะ: {reportData.status}</h4>
                  <hr className="hr-line-100" />
                  <div className="report-flex">
                    <div className="report-details">
                      <img
                        src={reportData.nutrDetails.image_profile}
                        alt={`${reportData.nutrDetails.firstname} ${reportData.nutrDetails.lastname}`}
                      />
                      <div className="report-info">
                        <p>
                          {reportData.nutrDetails.firstname}{" "}
                          {reportData.nutrDetails.lastname}
                        </p>
                        <p>{reportData.nutrDetails.email}</p>
                      </div>
                    </div>
                    <p className="report-date">
                      {calculateTimeAgo(reportData.updatedAt)}
                    </p>
                  </div>

                  <div className="report-details">
                    <div className="rp-dt">
                      <b>เกร็ดความรู้ที่ถูกรายงาน: </b>
                      <div className="tv-rp">
                        <h4>{reportData.triviaDetails.head}</h4>
                        <hr className="hr-line-90" />
                        <div className="img-rp">
                         <img className="img-tv"
                          src={reportData.triviaDetails.image}
                          alt={reportData.triviaDetails.head}
                        /> 
                        </div>
                        
                        <ReadMore text={reportData.triviaDetails.content} 
                          dangerouslySetInnerHTML={{ __html: reportData.triviaDetails.content }}/>
                   
                      </div> 
                      <div className="ps">
                         <p>หมายเหตุ: </p> 
                          <div className="rp-note">
                      <p>{reportData.note || "ไม่มีรายละเอียด"}</p>
                      </div>
                      </div>
                     
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportDetail;
