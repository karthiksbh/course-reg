import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Message from './Message';

export const Profile = () => {
    const [userProfile, setUserProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [message, setMessage] = useState('');
    const [colour, setColour] = useState('');

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + '/course/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }
            if (response.ok) {
                const data = await response.json();
                setUserProfile(data);
                // If the user is a teacher, hide sem and year
                if (data.is_fac) {
                    setEditedProfile({
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        ph_no: data.ph_no,
                    });
                } else {
                    setEditedProfile(data);
                }
            } else {
                console.error('Failed to fetch user profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + '/course/profile/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProfile),
            });
            if (response.ok) {
                setMessage("Profile updated successfully");
                setColour("#90EE90");
                setUserProfile(editedProfile);
                setIsEditing(false);
                setTimeout(() => {
                    window.location.href="/profile";
                }, 1000);
            } else {
                setMessage('Failed to update user profile');
                setColour("#FF6961");
                setTimeout(() => {
                    window.location.href="/profile";
                }, 1000);
            }
        } catch (error) {
            setMessage('Error updating user profile');
            setColour("#FF6961");
            setTimeout(() => {
                window.location.href="/profile";
            }, 1000);
        }
    };

    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <h2>Course Registration Portal</h2>
            <div>
            <h4>User Profile</h4>
            </div>
            <br></br>
            {isEditing ? (
                <>
                {message && <Message message={message} colour={colour}/>}
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={editedProfile.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={editedProfile.first_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={editedProfile.last_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            name="ph_no"
                            value={editedProfile.ph_no}
                            onChange={handleInputChange}
                        />
                    </div>
                    {!userProfile.is_fac && (
                        <>
                            <div>
                                <label>Year:</label>
                                <input
                                    type="text"
                                    name="year"
                                    value={editedProfile.year}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Semester:</label>
                                <input
                                    type="text"
                                    name="sem"
                                    value={editedProfile.sem}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </>
                    )}
                    {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
                    <button class="btn" onClick={handleSave}>Save</button>
                </>
            ) : (
                <div className="profile-info">
                    {message && <Message message={message} colour={colour}/>}
                    <br></br>
                    <div className="in-between">
                        <strong>Email:</strong> {userProfile.email}
                    </div>
                    <div className="in-between">
                        <strong>First Name:</strong> {userProfile.first_name}
                    </div>
                    <div className="in-between">
                        <strong>Last Name:</strong> {userProfile.last_name}
                    </div>
                    <div className="in-between">
                        <strong>Phone Number:</strong> {userProfile.ph_no}
                    </div>
                    {!userProfile.is_fac && (
                        <>
                            <div className="in-between">
                                <strong>Year:</strong> {userProfile.year}
                            </div>
                            <div className="in-between">
                                <strong>Semester:</strong> {userProfile.sem}
                            </div>
                        </>
                    )}
                    <button class="btn" onClick={handleEditClick}>EDIT</button>
                </div>
            )}
        </div>
    );
};

