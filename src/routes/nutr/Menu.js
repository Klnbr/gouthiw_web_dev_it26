import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import CreateMenu from '../../components/menu-manage/CreateMenu'
import EditMenu from '../../components/menu-manage/EditMenu'
import { useAuth } from '../../middleware/Auth';
import axios from 'axios';

function Menu() {

     const { nutrData } = useAuth();
     const location = useLocation();
     const { menuData } = location.state || {};
     const [ setMenu] = useState([])
     const [ setEditButton] = useState(false)

      useEffect(() => {
               const fetchMenu = async () => {
                    try {
                         const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/menus/auth/${nutrData._id}`, { timeout: 1000 });
                         setMenu(response.data)
     
                         if (menuData && response.data.some((menuItem) => menuItem._id === menuData._id)) {
                              setEditButton(true);
                         }
                    } catch (error) {
                         console.log("Error fetching menus data", error.message)
                    }
               }
               fetchMenu()
          }, [nutrData, menuData])
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