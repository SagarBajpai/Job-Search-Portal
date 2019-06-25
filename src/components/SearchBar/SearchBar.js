import React, { Component } from "react";
import "./SearchBar.css";
import Select from "react-select";

class SearchBar extends Component {
  render() {
    const { values, onChange, placeholder } = this.props;
    return (
      <div className="search">
        <input
          className="form-control"
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

SearchBar.defaultProps = {
  placeholder: "Search"
};

export default SearchBar;
