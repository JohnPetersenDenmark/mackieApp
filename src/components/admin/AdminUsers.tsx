
import React, { useEffect, useState } from 'react';
import { User } from '../../types/User';
import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';
import RegisterUser from '../../components/RegisterUser'

interface AdminUsersProps {
  isOpen: boolean;
  onClose: () => void;
}


const AdminUsers: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isCreateEditUserModalOpen, setIsCreateEditUserModalOpen] = useState(false);

  useEffect(() => {

    const fetchData = async () => {

      try {
        const locationsResponse: any = await AxiosClientGet('/Login/userlist', true);

        setUsers(locationsResponse);
        setLoading(false);

      } catch (err) {
        setError('Failed to load locations');
        setLoading(false);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();


  }, []);

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsCreateEditUserModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (user) {
      const deleteUser = async () => {
        try {
          setSubmitting(true);

        //  await AxiosClientDelete('/Admin/remoocation/' + location.id, true)


        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      };
      deleteUser();
    }
  };

   const handleNewUser = () => {
    setUserToEdit(null);
    setIsCreateEditUserModalOpen(true);
  };

 const handleCloseCreateEditUserModal = () => {
  setUserToEdit(null);
    setIsCreateEditUserModalOpen(false);
  };

  return (
    <div
      className="location-frame"
      style={{
        border: '1px solid grey',
        borderRadius: '5px',
        fontSize: '20px',
        color: '#22191b',
        fontWeight: 200,

        margin: 'auto',
      }}
    >
  
      <RegisterUser
        isOpen={isCreateEditUserModalOpen}
        userToEdit ={userToEdit}
        onClose={handleCloseCreateEditUserModal} />

      <div style={{
        fontSize: '2rem',
        fontWeight: 600,
        color: '#22191b',
        margin: '20px',
        textAlign: 'center' as const,
      }}>Brugere</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {users.map((user) => (
          <div key={user.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '2', padding: '0.5rem' }}>{user.username}</div>
            <div style={{ flex: '2', padding: '0.5rem' }}>{user.displayname}</div>
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(user)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(user)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 768px) {    
          .location-frame {
                      background-color: #8d4a5b;
      }
    }
  `}
      </style>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '1rem',
          borderRadius: '8px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleNewUser}
      >
        <img
          src="/images/new-icon.png"
          alt="Ny"
          style={{ width: '28px', height: '28px' }}
        />
      </div>
    </div>

  )
}

export default AdminUsers;