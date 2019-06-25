import React, { Component } from "react";
import "./Dropdown.css";
import Select from "react-select";

class Dropdown extends Component {
  render() {
    const { values, onChange } = this.props;
    return (
      <div className="select">
        <Select options={values} onChange={onChange} placeholder={"--Any--"} />
      </div>
    );
  }
}

Dropdown.defaultProps = {
  placeholder: "Search"
};

export default Dropdown;
