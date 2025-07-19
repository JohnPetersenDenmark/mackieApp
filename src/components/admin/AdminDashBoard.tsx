import React, { useEffect, useState } from 'react';

import AdminPlaces from './AdminPlaces'
import AdminCalendar from './AdminCalendar'
import AdminOrders from './AdminOrders'
import AdminAllOrders from './AdminAllOrders'
import AdminMenues from './AdminMenues'
 import RevenuePerTimePeriod from '../Statistic/RevenuePerTimePeriod'

import AdminSettings from './AdminSettings'
import AdminUsers from './AdminUsers'
import AdminPackingList from './AdminPackingList';
import { CurrentUser, useCurrentUser } from "../../components/CurrentUser";
import { useDashboardContext } from "./DashboardContext";

interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// const AdminDashBoard: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
const AdminDashBoard: React.FC = () => {

    const [activeMenu, setActiveMenu] = useState('Bestillinger');

    const { user, authStatus } = useCurrentUser();

    const { isOpen, setIsOpen } = useDashboardContext();

    const handleClose = () => {
        setIsOpen(false);
    };


    return (
        <>
            <div
                style={{

                    fontSize: '30px',
                    color: '#8d4a5b',
                    fontWeight: 700,
                    marginLeft: '0px',
                    marginTop: '40px',
                    marginBottom: '40px'
                }}
            >

                <div style={{ color: '#000000', textAlign: 'right', marginLeft: '100px' }}>  {user ? user.displayname : ''}</div>

                <div style={{ color: '#000000', textAlign: 'right', marginLeft: '100px' }}>


                    <button
                        onClick={handleClose}

                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#8d4a5b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                        }}
                    > Hjem</button>
                </div>

                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Revenue')}>Omsætning</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Stadepladser')}>Stadepladser</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Kalender')}>Kalender</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Bestillinger')}>Bestillinger</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('AlleBestillinger')}>Alle Bestillinger</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Pakkeliste')}>Pakkeliste</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Menuer')}>Menuer</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Brugere')}>Brugere</div>

                {activeMenu === 'Revenue' && <RevenuePerTimePeriod />}
                {activeMenu === 'Stadepladser' && <AdminPlaces />}
                {activeMenu === 'Kalender' && <AdminCalendar />}
                {activeMenu === 'AlleBestillinger' && <AdminAllOrders />}
                  {activeMenu === 'Bestillinger' && <AdminOrders />}
                {activeMenu === 'Pakkeliste' && <AdminPackingList />}
                {activeMenu === 'Menuer' && <AdminMenues />}
                {activeMenu === 'Brugere' && <AdminUsers />}
            </div>
        </>

    )
}

export default AdminDashBoard;