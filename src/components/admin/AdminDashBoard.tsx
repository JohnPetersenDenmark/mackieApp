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

    const [activeMenu, setActiveMenu] = useState('Dashboard');

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr ', gap: '0rem', fontSize: '36px', color: 'white' }}>
                <div style={{ background: '#8d4a5b', padding: '1rem', margin: 0 }}>
                    Mackie's Pizza Truck
                </div>

                <div style={{ background: '#8d4a5b', padding: '1rem', textAlign: "right" }}>
                    Log ud
                </div>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '0rem',
                fontSize: '40px',
                color: '#8d4a5b',
                fontWeight: 700,
                marginLeft : '100px',
                marginTop: '80px',
                marginBottom: '80px'
            }}>
               
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Dashboard')}>Dashboard</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Stadepladser')}>Stadepladser</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Kalender')}>Kalender</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Bestillinger')}>Bestillinger</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Pakkeliste')}>Pakkeliste</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Menuer')}>Menuer</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Indstillinger')}>Indstillinger</div>
                <div  style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('Brugere')}>Brugere</div>
            </div>

           
             <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '0rem',
                fontSize: '30px',
                color: '#8d4a5b',
                fontWeight: 700,
                marginLeft : '100px',
                 marginRight : '240px',
                marginTop: '80px',
                marginBottom: '80px'
            }}>
                {activeMenu === 'Dashboard' && <AdminSalePerMenu />}
                {activeMenu === 'Stadepladser' && <AdminPlaces />}
                {activeMenu === 'Kalender' && <AdminCalendar />}
                {activeMenu === 'Bestillinger' && <AdminOrders />}
                 {activeMenu === 'Pakkeliste' && <AdminPackingList />}
                {activeMenu === 'Menuer' && <AdminMenues />}
                {activeMenu === 'Indstillinger' && <AdminSettings />}
                {activeMenu === 'Brugere' && <AdminUsers />}
            </div>
        </div>
           
        
    )
}

export default AdminDashBoard;