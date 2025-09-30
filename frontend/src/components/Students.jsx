import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useFormik } from 'formik';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagenation from './pagination';


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

    // Course
    if (!values.course?.trim()) {
        errors.course = "Course is required";
    }

    // Date of Birth
    if (!values.dob) {
        errors.dob = "Date of Birth is required";
    }
    return errors;
};
function Student() {


    const navigate = useNavigate();
    const [dataShow, setdataShow] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [User, setIsUser] = useState({});
    const [currentPage, setcurrentPage] = useState(1)
    const [totalStudents, settotalStudents] = useState([])
    
    const totalPages = Math.ceil(totalStudents / 4);

    function checkId() {
        const Id = localStorage.getItem('id');
        if (!Id) {
            toast.error('Please Login')
            navigate('/signin')
        }
    }


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

    const courseKey = (e) => {
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


    async function handleEdit(user) {

        setIsUser(user);
        formik.values = user;
        setIsEditMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    const formik = useFormik({
        initialValues: {
            name: User?.name || '',
            email: User?.email || '',
            course: User?.course || '',
            dob: User?.dob || ''
        },
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            const objUser = {
                TeacherId: localStorage.getItem('id'),
                Name: values.name,
                Email: values.email,
                Course: values.course,
                DoB: values.dob
            };
            checkId()

            try {
                if (isEditMode) {
                    const token = localStorage.getItem('id');
                    const res = await axios.patch(`http://localhost:4000/student/update`, objUser,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("Updated:", res.data);
                    toast.success(res?.data?.message);
                    setIsUser({})

                    setIsEditMode(false);
                } else {
                    try {
                        const token = localStorage.getItem('id');
                        const res = await axios.post("http://localhost:4000/student/signup", objUser,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        toast.success("Student successfully Register!");
                        console.log("Created:", res.data);
                        formik.resetForm();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Signup failed");
                    }
                }

                dataGet();
            } catch (err) {
                toast.error(err.response?.data?.message || "Something went wrong");
                console.error(err.response?.data || err.message);
            }

        }
    });


    async function dataGet(pageNmbr) {
        setcurrentPage(pageNmbr)
        try {
            const token = localStorage.getItem('id');
            checkId()
            const res = await axios.get(`http://localhost:4000/student/${pageNmbr}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setdataShow(res.data.Data);
            settotalStudents(res.data.count);
            // console.log("setdataShow------> (1)", setdataShow);
        } catch (err) {
            toast.error(err.response?.data.message || "Failed to fetch data");
            console.error(err.response?.data || err.message);
        }

    }

    async function userDel(Email) {
        if (!checkId) {
            toast.error('Please Login')
            navigate('/signin')
        } else {
            try {
                const token = localStorage.getItem('id')
                const res = await axios.delete(`http://localhost:4000/student/del/${Email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Deleted:", res.data);
                toast.success(res?.data?.message);

                if (Email === formik.values.email) {
                    setIsUser({})
                    setIsEditMode(false);
                }
                dataGet();
            } catch (err) {
                console.error(err.response?.data || err.message);
                toast.error("Failed to delete user");
            }
        }
    }

    async function handleLogout() {
        localStorage.removeItem('id');
        navigate('/signin');
    };
    useEffect(() => {
        const idCheck = localStorage.getItem('id');
        if (!idCheck) {
            navigate('/signin');
        }
        // setTimeout(()=>{
        // localStorage.removeItem('id');
        // navigate('/signup')
        // },20000)
        dataGet();
    }, []);



    return (
        <>
            <div className="form-container signin" >
                <div className="lgout">
                    <button type='button' className='btn' onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                <div className="form-card">
                    <h2 className="title">{isEditMode ? "Update Student" : "Student Registration"}</h2>
                    <form id="form" className='form-fields' onSubmit={formik.handleSubmit}>
                        <div>
                            <input type="text"
                                className='input'
                                name="name"
                                placeholder="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onKeyDown={nameKey}
                            />
                            {formik.errors.name ? <p style={{ color: 'red' }}>{formik.errors.name}</p> : null}
                        </div>
                        <div>
                            <input type="email"
                                className='input'
                                name="email"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onKeyDown={emailKey}
                                disabled={isEditMode}
                                style={{ cursor: isEditMode ? "not-allowed" : "text" }}
                            />
                            {formik.errors.email ? <p style={{ color: 'red' }}>{formik.errors.email}</p> : null}
                        </div>
                        <div>
                            <input type="text"
                                className='input'
                                name="course"
                                placeholder="Course"
                                value={formik.values.course}
                                onChange={formik.handleChange}
                                onKeyDown={courseKey}
                            />
                            {formik.errors.course ? <p style={{ color: 'red' }}>{formik.errors.course}</p> : null}
                        </div>
                        <div>
                            <input type="date"
                                className='input'
                                name="dob"
                                placeholder="Date Of Birth"
                                value={formik.values.dob}
                                onChange={formik.handleChange}
                            />
                            {formik.errors.dob ? <p style={{ color: 'red' }}>{formik.errors.dob}</p> : null}
                        </div>
                        <input type="submit" value={isEditMode ? "Update" : "Craete"} className='btn' />
                    </form>
                </div>
            </div>

            <div className="table-container">
                {dataShow.length > 0 && (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Date of Birth</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataShow.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.course}</td>
                                    <td>{user.dob}</td>
                                    <td className="action-btn">
                                        <button className="update-btn" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="delete-btn" onClick={() => userDel(user.email)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}


                
                <div className="pagination-container">
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        
                        return (
                            <>
                            <button
                                key={pageNum}
                                onClick={() => dataGet(pageNum)}
                                className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
                                >
                                {pageNum}
                            </button>

                            </>
                        );
                    })}
                </div>
                {/* <Pagenation /> */}

            </div>
        </>
    )
}

export default Student;