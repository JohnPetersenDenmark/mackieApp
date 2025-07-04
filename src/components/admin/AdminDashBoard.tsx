import React, { useEffect, useState } from 'react';
import AdminSalePerMenu from './AdminSalePerMenu'
import AdminPlaces from './AdminPlaces'
import AdminCalendar from './AdminCalendar'
import AdminOrders from './AdminOrders'
import AdminMenues from './AdminMenues'
import AdminSettings from './AdminSettings'
import AdminUsers from './AdminUsers'
import AdminPackingList from './AdminPackingList';



const AdminDashBoard: React.FC = () => {

    const [activeMenu, setActiveMenu] = useState('Bestillinger');

    return (
        <>
            <div
                style={{
               /*      display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem', */
                    fontSize: '30px',
                    color: '#8d4a5b',
                    fontWeight: 700,
                    marginLeft: '0px',
                    marginTop: '40px',
                    marginBottom: '40px'
                }}
            >

                {/* <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Dashboard')}>Dashboard</div> */}
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Stadepladser')}>Stadepladser</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Kalender')}>Kalender</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Bestillinger')}>Bestillinger</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Pakkeliste')}>Pakkeliste</div>
                <div style={{ cursor: 'pointer', marginLeft: '100px' }} onClick={() => setActiveMenu('Menuer')}>Menuer</div>
                {/* <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Indstillinger')}>Indstillinger</div> */}
                {/* <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Brugere')}>Brugere</div> */}

                {/* {activeMenu === 'Dashboard' && <AdminSalePerMenu />} */}
                {activeMenu === 'Stadepladser' && <AdminPlaces />}
                {activeMenu === 'Kalender' && <AdminCalendar />}
                {activeMenu === 'Bestillinger' && <AdminOrders />}
                {activeMenu === 'Pakkeliste' && <AdminPackingList />}
                {activeMenu === 'Menuer' && <AdminMenues />}
                {/* {activeMenu === 'Indstillinger' && <AdminSettings />} */}
                {/* {activeMenu === 'Brugere' && <AdminUsers />} */}
            </div>
        </>

    )
}

export default AdminDashBoard;