import React from 'react'
import { useLocation } from 'react-router-dom';
import CreateMenu from '../components/menu-manage/CreateMenu'
import EditMenu from '../components/menu-manage/EditMenu'

function Menu() {
     const location = useLocation();
     const { menuData } = location.state || {};
     return (
          <>
               { menuData ? (
                    <EditMenu menuData={menuData} />
               ) : (
                    <CreateMenu />
               )}
          </>
     )
}

export default Menu