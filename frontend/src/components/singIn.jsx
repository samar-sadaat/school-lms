// import axios from "axios";
// import toast from "react-hot-toast";
// import { useFormik, Field } from 'formik';
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { eyeOff } from 'react-icons-kit/feather/eyeOff';
// import { eye } from 'react-icons-kit/feather/eye';


// const validate = values => {
//     const errors = {};

//     if (!values.email) {
//         errors.email = 'Required';
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//         errors.email = 'Invalid email address';
//     }

//     if (!values.password) {
//         errors.password = 'Required';
//     } else if (values.password.length < 8) {
//         errors.password = 'Must be 8 characters';
//     }


//     return errors;
// };

// function SignIn() {
//     const navigate = useNavigate();
//     const [showPassword, setShowPassword] = useState(false);

//     const passwordToggle = () => {
//         setShowPassword(!showPassword);
//     };

//     const passwordKey = (e) => {
//         if (e.key === ' ') {
//             e.preventDefault();
//         }
//     };

//     const emailKey = (e) => {
//         if (e.key === ' ') {
//             e.preventDefault();
//         }
//     };

//     const formik = useFormik({
//         initialValues: {
//             email: '',
//             password: '',
//             teacher: '',
//             student: ''
//         },
//         validate,
//         onSubmit: async values => {
//             const objUser = {
//                 Email: values.email.toLowerCase(),
//                 Password: values.password
//             };
//             console.log(values.teacher)
//             if (values.teacher) {
//                 try {
//                     const res = await axios.post("http://localhost:4000/teacher/login", objUser);

//                     if (res.data) {
//                         toast.success(res.data?.message);
//                         localStorage.setItem('id', res.data.token);
//                         navigate('/students');
//                     }
//                 } catch (err) {
//                     toast.error(err.response?.data?.message);
//                     console.error(err.response.data);
//                 }
//             } else if (values.student) {
//                 try {
//                     const res = await axios.post("http://localhost:4000/student/login", objUser);

//                     console.log(res.data)
//                     // if (res.data) {
//                     //     toast.success(res.data?.message);
//                     //     localStorage.setItem('id', res.data.token);
//                     //     navigate('/students');
//                     // }
//                 } catch (err) {
//                     toast.error(err.response?.data?.message);
//                     console.error(err.response.data);
//                 }
//             } else {
//                 toast.error('Login Fail');
//             }

//         }
//     });

//     return (
//         <>
//             <div className="form-container signin">
//                 <div className="form-card">
//                     <form id="form" className='form-fields' onSubmit={formik.handleSubmit}>
//                         <div>
//                             <input type="email" className='input' name="email" value={formik.values.email} placeholder="Email" onKeyDown={emailKey} onChange={formik.handleChange} />
//                             {formik.errors.email ? <p style={{ color: 'red' }}>{formik.errors.email}</p> : null}
//                         </div>
//                         <div className="relative">
//                             <input type={showPassword ? 'text' : 'password'} className='input' name="password" value={formik.values.password} placeholder="Password" onKeyDown={passwordKey} onChange={formik.handleChange} />
//                             <button
//                                 type='button'
//                                 icon={showPassword ? eyeOff : eye}
//                                 size={20}
//                                 onClick={passwordToggle}
//                                 className="absolute"
//                             >{showPassword ? "Hide" : "Show"}</button>
//                             {formik.errors.password ? <p style={{ color: 'red' }}>{formik.errors.password}</p> : null}
//                         </div>
//                         <div className="radio">
//                             <label>
//                                 <input
//                                     type="radio"
//                                     name="login"
//                                     value="loginStudent"
//                                     onChange={formik.handleChange}
//                                 />
//                                 Teacher
//                             </label>
//                             <label>
//                                 <input
//                                     type="radio"
//                                     name="login"
//                                     value="loginTeacher"
//                                     onChange={formik.handleChange}
//                                 />
//                                 Students
//                             </label>
//                         </div>
//                         <div className="btns">
//                             <input type="submit" className='btn' value="Login" />
//                             <p>Don't have an acount? <Link to={'/'}>SignUp</Link></p>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default SignIn;



import axios from "axios";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
// import { eyeOff } from "react-icons-kit/feather/eyeOff";
// import { eye } from "react-icons-kit/feather/eye";

const validate = (values) => {
    const errors = {};

    if (!values.email) {
        errors.email = "Required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = "Invalid email address";
    }

    if (!values.password) {
        errors.password = "Required";
    } else if (values.password.length < 8) {
        errors.password = "Must be 8 characters";
    }

    if (!values.login) {
        errors.login = "Please select Teacher or Student";
    }

    return errors;
};

function SignIn() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const passwordToggle = () => {
        setShowPassword(!showPassword);
    };

    const passwordKey = (e) => {
        if (e.key === " ") e.preventDefault();
    };

    const emailKey = (e) => {
        if (e.key === " ") e.preventDefault();
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            login: "",
        },
        validate,
        onSubmit: async (values) => {
            const objUser = {
                Email: values.email.toLowerCase(),
                Password: values.password,
            };

            try {
                if (values.login === "loginTeacher") {
                    const res = await axios.post(`${API_URL}/teacher/login`, objUser);
                    toast.success(res.data?.message);
                    localStorage.setItem("id", res.data.token);
                    navigate("/students");
                } else if (values.login === "loginStudent") {
                    const res = await axios.post(`${API_URL}/student/login`, objUser);
                    toast.success(res.data?.message);
                    localStorage.setItem("id", res.data.token);
                    navigate("/studentsDashbord");
                } else {
                    toast.error("Login Fail");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Something went wrong");
                console.error(err.response?.data);
            }
        },
    });

    return (
        <div className="form-container signin">
            <div className="form-card">
                <form id="form" className="form-fields" onSubmit={formik.handleSubmit}>
                    <div>
                        <input
                            type="email"
                            className="input"
                            name="email"
                            value={formik.values.email}
                            placeholder="Email"
                            onKeyDown={emailKey}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.email && (
                            <p style={{ color: "red" }}>{formik.errors.email}</p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input"
                            name="password"
                            value={formik.values.password}
                            placeholder="Password"
                            onKeyDown={passwordKey}
                            onChange={formik.handleChange}
                        />
                        <button
                            type="button"
                            onClick={passwordToggle}
                            className="absolute"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                        {formik.errors.password && (
                            <p style={{ color: "red" }}>{formik.errors.password}</p>
                        )}
                    </div>

                    <div className="radio">
                        <label>
                            <input
                                type="radio"
                                name="login"
                                value="loginTeacher"
                                checked={formik.values.login === "loginTeacher"}
                                onChange={formik.handleChange}
                            />
                            Teacher
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="login"
                                value="loginStudent"
                                checked={formik.values.login === "loginStudent"}
                                onChange={formik.handleChange}
                            />
                            Student
                        </label>
                    </div>
                    {formik.errors.login && (
                        <p style={{ color: "red" }}>{formik.errors.login}</p>
                    )}

                    <div className="btns">
                        <input type="submit" className="btn" value="Login" />
                        <p>
                            Don't have an account? <Link to={"/"}>SignUp</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
