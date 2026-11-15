import Menu from '@/components/shared/Menu'
import React from 'react'

const DashboardLayout = ({children}:{children : React.ReactNode}) => {
  return (
    <div className="lg:ml-74 bg-slate-50 min-h-screen">
      <Menu />
      {children}
    </div>
  );
}

export default DashboardLayout