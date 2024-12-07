import React from 'react'
import { useSelector } from 'react-redux'
import { useGetUserStatsQuery } from '../../../../redux/features/stats/statsApi';
import UserStats from './UserStats';

const UserDMain = () => {
    const {user} = useSelector((state) => state.auth);
    const {data: stats, error, isLoading} = useGetUserStatsQuery(user?.email)
    console.log(stats)
    if(isLoading) return <div className='text-center text-gray-500'>Loading...</div>
    if(!stats) {
        return <div className='text-center text-gray-500'>No data available.</div>
    }

   

  return (
    <div className='p-6'>
        <div>
            <h1 className='text-2xl font-semibold mb-4'>User Dashboard</h1>
            <p className='text-gray-500'>Hi, {user?.username}! Welcome to your user dashboard</p>
        </div>
        <UserStats stats={stats}/>
    </div>
  )
}

export default UserDMain