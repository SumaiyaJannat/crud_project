import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { adddata } from './context/ContextProvider';

const Register = () => {

    const { setUdata } = useContext(adddata);

    const navigate = useNavigate();

    const [inpval, setINP] = useState({
        name: "",
        email: "",
        mobile: "",
        profession: "",
        interests: [],
        bio: ""
    })

    const professions = {
        marketing: ['Growth Marketing', 'Digital Marketing', 'Product Marketing', 'Paid Marketing', 'Organic Marketing'],
        entrepreneur: ['Startup Enthusiast', 'SME', 'Product Enthusiast', 'Product Leader', 'Product Owner'],
        contentCreator: ['YouTube', 'Twitch', 'Twitter', 'Video Content']
    };

    const setdata = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setINP((preval) => {
                const newInterests = preval.interests.includes(value)
                    ? preval.interests.filter((interest) => interest !== value)
                    : [...preval.interests, value];
                return { ...preval, interests: newInterests };
            });
        } else {
            setINP((preval) => {
                return {
                    ...preval,
                    [name]: value
                }
            });
        }
    }

    const addinpdata = async (e) => {
        e.preventDefault();

        const { name, email, mobile, profession, interests, bio } = inpval;

        if (name === "") {
            alert("name is required")
        } else if (email === "") {
            alert("email is required")
        } else if (!email.includes("@")) {
            alert("enter valid email")
        } else if (mobile === "") {
            alert("mobile is required")
        } else {
            const res = await fetch("/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, mobile, profession, interests, bio
                })
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 422 || !data) {
                console.log("error ");
                alert("error");
            } else {
                navigate("/");
                setUdata(data);
                console.log("data added");
            }
        }
    }

    return (
        <div className="container">
            <NavLink to="/">home</NavLink>
            <form className="mt-4">
                <div className="row">
                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" value={inpval.name} onChange={setdata} name="name" className="form-control" id="name" />
                    </div>
                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" value={inpval.email} onChange={setdata} name="email" className="form-control" id="email" />
                    </div>
                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="mobile" className="form-label">Mobile</label>
                        <input type="number" value={inpval.mobile} onChange={setdata} name="mobile" className="form-control" id="mobile" />
                    </div>
                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                        <label htmlFor="profession" className="form-label">Profession</label>
                        <select value={inpval.profession} onChange={setdata} name="profession" className="form-control" id="profession">
                            <option value="">Select Profession</option>
                            <option value="marketing">Marketing Professional</option>
                            <option value="entrepreneur">Entrepreneur</option>
                            <option value="contentCreator">Content Creator</option>
                        </select>
                    </div>
                    {inpval.profession && (
                        <div className="mb-3 col-lg-12 col-md-12 col-12">
                            <label className="form-label">Interests</label>
                            <div>
                                {professions[inpval.profession].map((interest) => (
                                    <div key={interest} className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="interests" value={interest} onChange={setdata} checked={inpval.interests.includes(interest)} />
                                        <label className="form-check-label">{interest}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mb-3 col-lg-12 col-md-12 col-12">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <textarea name="bio" value={inpval.bio} onChange={setdata} className="form-control" id="bio" cols="30" rows="3" maxLength="50"></textarea>
                    </div>
                    <button type="submit" onClick={addinpdata} className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Register;
