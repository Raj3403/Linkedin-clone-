  import React, { useState } from "react";
  import { AiOutlineClose } from "react-icons/ai";
  import { editProfile } from "../../../api/FirestoreAPI";
  import "./index.scss";

  export default function ProfileEdit({ onEdit, currentUser }) {
    const [editInputs, seteditInputs] = useState(currentUser);
    const getInput = (event) => {
      let { name, value } = event.target;
      let input = { [name]: value };
      seteditInputs({ ...editInputs, ...input });
    };

    const updateProfileData = async () => {
      await editProfile(currentUser?.userID, editInputs);
      await onEdit();
    };

    return (
      <div className="profile-card">
        <div className="edit-btn">
          <AiOutlineClose className="close-icon" onClick={onEdit} />
        </div>

        <div className="profile-edit-inputs">
          <label>Name</label>     
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Name"
            name="name"
            value={editInputs.name}
          />
          <label>Headline</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Headline"
            name="headline"
            value={editInputs.headline}
          />
          <label>Country</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Country"
            name="country"
            value={editInputs.country}
          />
          <label>City</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="City"
            name="city"
            value={editInputs.city}
          />
          <label>Company</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Company"
            name="company"
            value={editInputs.company}
          />
          <label>Industry</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Industry"
            name="industry"
            value={editInputs.industry}
          />
          <label>College</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="College"
            name="college"
            value={editInputs.college}
          />
          <label>Website</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Website"
            name="website"
            value={editInputs.website}
          />
          <label>About Me</label>
          <textarea
            onChange={getInput}
            className="common-textArea"
            placeholder="AboutMe"
            rows={5}
            name="aboutMe"
            value={editInputs.aboutMe}
          />
          <label>Skills</label>
          <input
            onChange={getInput}
            className="common-input"
            placeholder="Skills"
            name="skills"
            value={editInputs.skills}
          />
        </div>
        <div className="save-container">
          <button className="save-btn" onClick={updateProfileData}>
            Save
          </button>
        </div>
      </div>
    );
  }
