import Menu from '@/components/shared/Menu'
import React from 'react'

const DashboardLayout = ({children}:{children : React.ReactNode}) => {
  return (
    <div>
        <Menu/>
        {children}
    </div>
  )
}

export default DashboardLayout