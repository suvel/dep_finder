import React from 'react'
import { Outlet } from "react-router-dom";

const SecureRoutWrapper = () => {
    return (
        <Outlet />
    )
}

export default SecureRoutWrapper