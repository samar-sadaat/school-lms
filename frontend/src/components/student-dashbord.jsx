import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useFormik } from 'formik';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagenation from './pagination';

const validate = values => {
    const errors = {};

    if (!values.course?.trim()) {
        errors.course = "Course is required";
    }

    if (!values.courseCode) {
        errors.courseCode = "Course Code required";
    } else if (!/^[A-Za-z]{2,3}-\d{2,3}$/.test(values.courseCode)) {
        errors.courseCode = "Correct Pattren (CSC-123)";
    }

    if (!values.slot) {
        errors.slot = 'Slot is Required'
    }

    return errors;
};


function StudentDashboard() {
const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL------> (1)", API_URL);

    const navigate = useNavigate();
    const [dataShow, setdataShow] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [User, setIsUser] = useState({});

    // const [currentPage, setcurrentPage] = useState(1)
    // const [totalStudents, settotalStudents] = useState([])

    // const totalPages = Math.ceil(totalStudents / 4);

    function checkId() {
        const Id = localStorage.getItem('id');
        if (!Id) {
            toast.error('Please Login')
            navigate('/signin')
        }
    }


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

    const courseCodeKey = (e) => {

        if (
            e.key === "Backspace" ||
            e.key === "Delete" ||
            e.key === "Tab" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
        ) {
            return;
        }

        if (e.key === " ") {
            e.preventDefault();
        }

        if (/^[A-Za-z]{2,3}-\d{2,3}$/.test(e.key) || e.target.value.length >= 7) {
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
            course: User?.course || '',
            courseCode: (User?.courseCode || '').toUpperCase(),
            slot: User?.slot || "Morning",
            searchCourse: "",
            searchCode: "",
            searchSlot: ""
        },
        enableReinitialize: true,
        validate,
        onSubmit: async values => {
            const objCourse = {
                StudentId: localStorage.getItem('id'),
                Course: values.course,
                CourseCode: values.courseCode,
                Slot: values.slot,
            };
            checkId()

            try {
                if (isEditMode) {
                    const token = localStorage.getItem('id');
                    const res = await axios.patch(`${API_URL}/course/update`, objCourse,
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
                        const res = await axios.post(`${API_URL}/course/create`, objCourse,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        toast.success("Course successfully Register!");
                        console.log("Created:", res.data);
                        formik.resetForm();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Craetion failed");
                    }
                }

                dataGet();
            } catch (err) {
                toast.error(err.response?.data?.message || "Something went wrong");
                console.error(err.response?.data || err.message);
            }

        }
    });

    const filteredData = dataShow.filter((user) => {
        return (
            (!formik.values.searchCourse ||
                user.course.toLowerCase().includes(formik.values.searchCourse.toLowerCase())) &&
            (!formik.values.searchCode ||
                user.courseCode.toLowerCase().includes(formik.values.searchCode.toLowerCase())) &&
            (!formik.values.searchSlot ||
                user.slot.toLowerCase().includes(formik.values.searchSlot.toLowerCase()))
        );
    });


    async function dataGet() {
        // setcurrentPage(pageNmbr)
        try {
            const token = localStorage.getItem('id');
            checkId()
            const res = await axios.get(`${API_URL}/course`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setdataShow(res.data.Data);

            // settotalStudents(res.data.count);
        } catch (err) {
            toast.error(err.response?.data.message || "Failed to fetch data");
            console.error(err.response?.data || err.message);
        }

    }

    async function userDel(Course) {
        if (!checkId) {
            toast.error('Please Login')
            navigate('/signin')
        } else {
            try {
                const token = localStorage.getItem('id')
                const res = await axios.delete(`${API_URL}/course/del/${Course}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Deleted:", res.data.message);
                toast.success(res?.data?.message);

                if (Course === formik.values.course) {
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

    const options = [
        { value: 'Morning', label: 'Morning' },
        { value: 'Evening', label: 'Evening' },
    ];

    return (
        <>
            <div className="form-container signin" >
                <div className="lgout">
                    <button type='button' className='btn' onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                <div className="form-card">
                    <h2 className="title">{isEditMode ? "Update Course" : "Course Registration"}</h2>
                    <form id="form" className='form-fields' onSubmit={formik.handleSubmit}>
                        <div>
                            <input type="text"
                                className='input'
                                name="course"
                                placeholder="Course"
                                value={formik.values.course}
                                onChange={formik.handleChange}
                                onKeyDown={courseKey}
                                disabled={isEditMode}
                                style={{ cursor: isEditMode ? "not-allowed" : "text" }}
                            />
                            {formik.errors.course ? <p style={{ color: 'red' }}>{formik.errors.course}</p> : null}
                        </div>
                        <div>
                            <input type="text"
                                className='input'
                                name="courseCode"
                                placeholder="Course Code"
                                // pattern='/^[A-Z]{2,4}[ -]?\d{3}$/'
                                value={formik.values.courseCode}
                                onKeyDown={courseCodeKey}
                                onChange={(e) =>
                                    formik.setFieldValue("courseCode", e.target.value.toUpperCase())
                                }
                            // onChange={formik.handleChange}
                            />
                            {formik.errors.courseCode ? <p style={{ color: 'red' }}>{formik.errors.courseCode}</p> : null}
                        </div>
                        <div>
                            <select
                                className='input course-select'
                                name="slot"
                                value={formik.values.slot}
                                onChange={formik.handleChange}
                            >
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {formik.errors.slot ? <p style={{ color: 'red' }}>{formik.errors.slot}</p> : null}
                        </div>
                        <input type="submit" value={isEditMode ? "Update" : "Create"} className='btn' />
                    </form>
                </div>
            </div>
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr className='tr'>
                            <th>Id</th>
                            <th>Course</th>
                            <th>Course Code</th>
                            <th>Slot </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Search row */}
                        <tr>
                            <td></td>
                            <td>
                                <input
                                    type="search"
                                    className="input search"
                                    placeholder="Search course..."
                                    name='searchCourse'
                                    value={formik.values.searchCourse}
                                    onChange={formik.handleChange}
                                // value={searchCourse}
                                // onChange={(e) => setSearchCourse(e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="search"
                                    className="input search"
                                    placeholder="Search code..."
                                    name='searchCode'
                                    vvalue={formik.values.searchCode}
                                    onChange={formik.handleChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="search"
                                    className="input search"
                                    placeholder="Search slot..."
                                    name='searchSlot'
                                    value={formik.values.searchSlot}
                                    onChange={formik.handleChange}
                                />
                            </td>
                            <td></td>
                        </tr>

                        {/* Data rows */}
                        {filteredData.length > 0 ? (
                            filteredData.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.course}</td>
                                    <td>{user.courseCode}</td>
                                    <td>{user.slot}</td>
                                    <td className="action-btn">
                                        <button className="update-btn" onClick={() => handleEdit(user)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => userDel(user.course)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 py-4">
                                    No items found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* <div className="table-container">
                {dataShow.length > 0 && (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Course</th>
                                <th>Course Code</th>
                                <th>Slot</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <input
                                        type="search"
                                        className='input search'
                                        placeholder="Search..."

                                    />
                                </td>
                                <td>
                                    <input
                                        type="search"
                                        className='input search'
                                        placeholder="Search..."

                                    />
                                </td>
                                <td>
                                    <input
                                        type="search"
                                        className='input search'
                                        placeholder="Search..."

                                    />
                                </td>
                            </tr>
                            {dataShow.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.course}</td>
                                    <td>{user.courseCode}</td>
                                    <td>{user.slot}</td>
                                    <td className="action-btn">
                                        <button className="update-btn" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="delete-btn" onClick={() => userDel(user.course)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )} */}


            {/* 
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
                </div> */}

            {/* </div> */}
        </>
    )
}


export default StudentDashboard;

