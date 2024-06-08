import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { updatedata } from './context/ContextProvider'

const Edit = () => {
    const { setUPdata } = useContext(updatedata);
    const navigate = useNavigate();
    const { id } = useParams();

    const [inpval, setINP] = useState({
        name: "",
        email: "",
        mobile: "",
        profession: "", // New field for profession
        interests: [], // New field for interests
        bio: "" // New field for bio
    });

    const setdata = (e) => {
        const { name, value } = e.target;
        setINP((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInterestChange = (e) => {
        const { value } = e.target;
        setINP((prevState) => ({
            ...prevState,
            interests: [...prevState.interests, value]
        }));
    };

    const getdata = async () => {
        try {
            const res = await fetch(`/induser/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if (res.status === 422 || !data) {
                console.log("Error fetching user data");
            } else {
                setINP(data[0]);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const updateuser = async (e) => {
        e.preventDefault();

        const { name, email, mobile, profession, interests, bio } = inpval;

        try {
            const res = await fetch(`/updateuser/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, mobile, profession, interests, bio })
            });

            const data = await res.json();

            if (res.status === 422 || !data) {
                alert("Fill the data");
            } else {
                navigate("/");
                setUPdata(data);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="container">
            <NavLink to="/">Home</NavLink>
            <div className="mt-4">
                <h2>Edit User</h2>
                <p>User ID: {id}</p>
                <p>Name: {inpval.name}</p>
                <p>Email: {inpval.email}</p>
                <p>Mobile: {inpval.mobile}</p>
                <label htmlFor="profession">Profession:</label>
                <select id="profession" name="profession" value={inpval.profession} onChange={setdata}>
                    <option value="">Select profession...</option>
                    <option value="Marketing Professional">Marketing Professional</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Content Creator">Content Creator</option>
                </select>
                {inpval.profession && (
                    <div>
                        <p>Select Interests:</p>
                        <input type="checkbox" id="growthMarketing" name="interests" value="Growth Marketing" onChange={handleInterestChange} />
                        <label htmlFor="growthMarketing"> Growth Marketing</label><br />
                        {/* Add other interest options here */}
                    </div>
                )}
                <label htmlFor="bio">Bio:</label>
                <textarea id="bio" name="bio" value={inpval.bio} onChange={setdata} rows="3" maxLength="50"></textarea>
            </div>
            <form className="mt-4">
                {/* Your form inputs */}
            </form>
            <button type="submit" onClick={updateuser} className="btn btn-primary">Submit</button>
        </div>
    );
};

export default Edit;
