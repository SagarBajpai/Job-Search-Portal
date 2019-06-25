import React, { Component } from "react";
import "./JobCards.css";

class JobCards extends Component {
  render() {
    const {
      title,
      companyname,
      experience,
      location,
      salary,
      skills,
      startdate,
      type,
      applylink
    } = this.props;
    let _title;
    let flag = 0;
    if (title.length > 65) {
      flag = 1;
      _title = title.substring(0, 64);
    }
    return (
      <div className="_outer">
        <div className="_cards">
          <h5 className="_title">{flag ? _title : title}</h5>
          <p className="_companyname">{companyname}</p>
          <div className="job_description">
            <div>
              <label>Experience : </label>
              <p className="_experience">{experience}</p>
              <span className="loc_label">
                <label>Location : </label>
                <p className="_location">{location}</p>
              </span>
            </div>
            <div>
              <label>Skills : </label>
              <p>{skills}</p>
            </div>
            <div>
              <label>Type : </label>
              <p>{type}</p>
            </div>
            <div>
              <label>Salary : </label>
              <p>{salary}</p>
            </div>
            <div>
              <label>Starting Date : </label>
              <p>{startdate}</p>
            </div>
          </div>
          <div className="apply_button">
            <a href={applylink} target="_blank">
              Apply
            </a>
          </div>
        </div>
      </div>
    );
  }
}
JobCards.defaultProps = {
  title: "Frontend Developer",
  companyname: "Think & Learn",
  salary: "Upto industry standard",
  startdate: "Immediate",
  type: "permanent"
};

export default JobCards;
