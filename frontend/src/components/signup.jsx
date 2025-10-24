import { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
const API_URL = import.meta.env.VITE_API_URL;

const validate = values => {
    const errors = {};

    // Name
    if (!values.name?.trim()) {
        errors.name = "Name is required";
    } else if (values.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!values.email?.trim()) {
        errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    }

    // Department
    if (!values.department?.trim()) {
        errors.department = "Department is required";
    }

    // Password
    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }
    // // Id
    // if (!values.id?.trim()) {
    //     errors.id = "Id is required";
    // } else if (!/^(?=.*[A-Za-z]{2})(?=.*\d{2})[A-Za-z\d]{4,}$/.test(values.id)) {
    //     errors.id = "Id must contain at least 2 digits and 4 letters";
    // }

    return errors;
};



function InputData() {
    const navigate = useNavigate();
    // const [dataShow, setdataShow] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const passwordToggle = () => {
        setShowPassword(!showPassword);
    };

    const nameKey = (e) => {
        if (!/^[A-Za-z ]+$/.test(e.key)) {
            e.preventDefault();
        }

        if (e.key === " " && e.target.selectionStart === 0) {
            e.preventDefault();
        }

        if (e.key === " " && e.target.value[e.target.selectionStart - 1] === " ") {
            e.preventDefault();
        }
    };

    const emailKey = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };

    const departmentKey = (e) => {
        if (!/^[A-Za-z ]+$/.test(e.key)) {
            e.preventDefault();
        }

        if (e.key === " " && e.target.selectionStart === 0) {
            e.preventDefault();
        }

        if (e.key === " " && e.target.value[e.target.selectionStart - 1] === " ") {
            e.preventDefault();
        }
    };

    const passwordKey = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
        }
    };

    // const idKey = (e) => {
    //     if (
    //         e.key === "Backspace" ||
    //         e.key === "Delete" ||
    //         e.key === "Tab" ||
    //         e.key === "ArrowLeft" ||
    //         e.key === "ArrowRight"
    //     ) {
    //         return;
    //     }
    //     if (e.key === ' ') {
    //         e.preventDefault();
    //     }
    //     if (/^(?=.*[A-Za-z]{2})(?=.*\d{2})[A-Za-z\d]{4,}$/.test(e.key) || e.target.value.length >= 4) {
    //         e.preventDefault();
    //     }
    // };



    // async function handleEdit(user) {

    //     formik.values.name = user.Name;
    //     formik.values.email = user.Email;
    //     formik.values.age = user.Age;
    //     formik.values.password = user.Password;

    //     await setIsEditMode(true);
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // }

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            department: '',
            password: ''
        },

        validate,
        onSubmit: async values => {
            const objUser = {
                Name: values.name,
                Email: values.email.toLowerCase(),
                Department: values.department,
                Password: values.password
            };

            try {
                if (isEditMode) {
                    const res = await axios.patch(`${API_URL}/user/update/`, objUser);
                    console.log("Updated:", res.data);
                    toast.success("User updated successfully!");
                    setIsEditMode(false);
                    formik.resetForm();
                } else {
                    try {
                        const res = await axios.post(`${API_URL}/teacher/signup`, objUser);
                        toast.success("Signup successful!");
                        console.log("Created:", res.data);
                        // console.log(objUser)
                        formik.resetForm();
                        navigate('/signin');
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Signup failed");
                    }
                }

                // dataGet();
            } catch (err) {
                toast.error(err.response?.data?.message || "Something went wrong");
                console.error(err.response?.data || err.message);
            }

        }
    });


    // async function dataGet() {
    //     try {
    //         const res = await axios.get("http://localhost:4000/user/");
    //         setdataShow(res.data);
    //     } catch (err) {
    //         toast.error("Failed to fetch data");
    //         console.error(err.response?.data || err.message);
    //     }
    // }

    // async function userDel(Email) {
    //     try {
    //         const res = await axios.delete(`http://localhost:4000/user/del/${Email}`);
    //         console.log("Deleted:", res.data);
    //         toast.success("User deleted!");
    //         if(Email === res.data){
    //             formik.resetForm();
    //             setIsEditMode(false);
    //         }
    //         dataGet();
    //     } catch (err) {
    //         console.error(err.response?.data || err.message);
    //         toast.error("Failed to delete user");
    //     }
    // }

    // useEffect(() => {
    //     dataGet();
    // }, [])



    return (
        <>
            <div className="page">
                <h2 className="logo">React App</h2>
                <ul className="nav-links">
                    <Link to={'/signup'}>SignUp</Link>
                    <Link to={'/signin'}>SignIn</Link>
                </ul>
            </div>
            <div className="form-container">
                <div className="form-card">
                    <h2 className="title">{isEditMode ? "Update Teacher" : "Teacher Registration"}</h2>
                    <form id="form" className='form-fields' onSubmit={formik.handleSubmit}>
                        {/* <div>
                            <input type="text"
                                className='input'
                                name="id"
                                value={formik.values.id}
                                placeholder="Teacher Id"
                                onKeyDown={idKey}
                                onChange={formik.handleChange}
                                disabled={isEditMode}
                                style={{ cursor: isEditMode ? "not-allowed" : "text" }}
                                />
                            {formik.errors.id ? <p style={{ color: 'red' }}>{formik.errors.id}</p> : null}
                        </div> */}
                        <div>
                            <input type="text"
                                className='input'
                                name="name"
                                value={formik.values.name}
                                placeholder="Name"
                                onKeyDown={nameKey}
                                onChange={formik.handleChange} />
                            {formik.errors.name ? <p style={{ color: 'red' }}>{formik.errors.name}</p> : null}
                        </div>
                        <div>
                            <input type="email"
                                className='input'
                                name="email"
                                value={formik.values.email}
                                placeholder="Email"
                                onKeyDown={emailKey}
                                onChange={formik.handleChange}
                                disabled={isEditMode}
                                style={{ cursor: isEditMode ? "not-allowed" : "text" }} />
                            {formik.errors.email ? <p style={{ color: 'red' }}>{formik.errors.email}</p> : null}
                        </div>
                        <div>
                            <input type="text"
                                className='input'
                                name="department"
                                value={formik.values.department}
                                placeholder="Department"
                                onKeyDown={departmentKey}
                                onChange={formik.handleChange} />
                            {formik.errors.department ? <p style={{ color: 'red' }}>{formik.errors.department}</p> : null}
                        </div>
                        <div className='relative'>
                            <input type={showPassword ? 'text' : 'password'}
                                className='input'
                                name="password"
                                value={formik.values.password}
                                placeholder="Password"
                                onKeyDown={passwordKey}
                                onChange={formik.handleChange}
                                disabled={isEditMode}
                                style={{ cursor: isEditMode ? "not-allowed" : "text" }} />
                            <button
                                type='button'
                                icon={showPassword ? eyeOff : eye}
                                size={20}
                                onClick={passwordToggle}
                                className="absolute"
                            >{showPassword ? "Hide" : "Show"}</button>
                            {formik.errors.password ? <p style={{ color: 'red' }}>{formik.errors.password}</p> : null}
                        </div>
                        <input type="submit" value={isEditMode ? "Update" : "Submit"} className='btn' />
                    </form>
                </div>
            </div>

            {/* <div className="table-container">
                {dataShow.length > 0 && (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataShow.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.Name}</td>
                                    <td>{user.Email}</td>
                                    <td>{user.Age}</td>
                                    <td>{user.Password}</td>
                                    <td className="action-btn">
                                        <button className="update-btn" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="delete-btn" onClick={() => userDel(user.Email)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div> */}
        </>
    )
}

export default InputData;