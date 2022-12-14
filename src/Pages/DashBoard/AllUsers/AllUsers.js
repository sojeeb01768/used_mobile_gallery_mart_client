import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../Shared/ConfirmationModal/ConfirmationModal';

const AllUsers = () => {
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('https://used-mobile-gallery-server.vercel.app/users?userType=buyer');

            const data = await res.json();
            return data;
        }
    })
    // deleting funsctions
    const [deletingUser, setDeletingUser] = useState(null);
    const closeModal = () => {
        setDeletingUser(null);
    }

    const handleDeleteUser = (user) => {
        fetch(`https://used-mobile-gallery-server.vercel.app/users/${user._id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    console.log(data);
                    refetch();
                    toast.success(`${user.name}Deleted Successful`)
                }
            })
    }



    // console.log(users);
    const handleMakeAdmin = (id) => {
        fetch(`https://used-mobile-gallery-server.vercel.app/users/admin/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    toast.success('Make Admin Successfully')
                    refetch();
                }
            })

    }


    return (
        <div>
            <h2 className='text-center text-4xl my-10 font-bold'>All Buyers</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    {/* <!-- head --> */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>User Type</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <!-- row 1 --> */}
                        {
                            users.map((user, i) => <tr
                                key={user._id}
                            >
                                <th>{i + 1}</th>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>{user?.userType}</td>
                                {/* <td>{user?.userType !== 'admin' && <button onClick={() => handleMakeAdmin(user._id)} className='btn btn-primary btn-xs text-white'>Seller</button>}</td> */}
                                <td>
                                    <label onClick={() => setDeletingUser(user)} htmlFor="confirmation-modal" className="btn btn-error  text-white">Delete</label>

                                </td>
                            </tr>)
                        }


                    </tbody>
                </table>
            </div>
            {
                deletingUser && <ConfirmationModal
                    title={`Are you sure`}
                    message={`Parmanently Delete ${deletingUser.name}?`}
                    closeModal={closeModal}
                    successAction={handleDeleteUser}
                    modalData={deletingUser}
                    successButtonName="Delete"
                >

                </ConfirmationModal>
            }
        </div>
    );
};

export default AllUsers;