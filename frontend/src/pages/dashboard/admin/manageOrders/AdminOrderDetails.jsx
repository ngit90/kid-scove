import React from 'react'
import { useGetOrderByIdQuery } from '../../../../redux/features/orders/orderApi'
import { useParams, Link } from 'react-router-dom';
import { FaAngleDoubleLeft } from "react-icons/fa";
import TimelineStep from '../../../../components/TimelineStep';

const AdminOrderDetails = () => {
    const { id } = useParams();
    console.log(id)
    const { data: order, error, isLoading } = useGetOrderByIdQuery(id);
  
    if(isLoading) return <div>Loading...</div>
    if(error)  return <div>No orders!</div>

    
    const isCompleted = (status) => {
        const statuses = ["confirmed", "processing", "shipped", "completed"];
        return statuses.indexOf(status) < statuses.indexOf(order.status)
    }

    const isCurrent = (status) => order.status ===  status;
    const steps = [
        {
          status: 'confirmed',
          label: 'confirmed',
          description: 'Your order has been created and is awaiting processing.',
          icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
        },
        {
          status: 'processing',
          label: 'Processing',
          description: 'Your order is currently being processed.',
          icon: { iconName: 'loader-line', bgColor: 'yellow-800', textColor: 'yellow-800' },
        },
        {
          status: 'shipped',
          label: 'Shipped',
          description: 'Your order has been shipped.',
          icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
        },
        {
          status: 'completed',
          label: 'Completed',
          description: 'Your order has been successfully completed.',
          icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
        },
      ];
    
    return (
        <section className='section__container rounded p-2'>
            <Link to="/dashboard/manage-orders" className='text-red-500 px-1 underline'><FaAngleDoubleLeft />Back </Link>
        <h2 className='text-2xl font-semibold mb-4'>Order {order?.status}</h2>
        <p className='mb-4'>Order Id: {order?._id}</p>
        <p className='mb-4'>Status: {order?.status}</p>
        <p className='mb-4'>Total Amount: {order?.amount}</p>
        <p className='mb-4'>Delivery Address :  {order?.address.firstName}, {order?.address.LastName}, {order?.address.email}, {order?.address.street}, {order?.address.city},{order?.address.phone}. </p>

        <ol className='sm:flex items-center relative'>
        {steps.map((step, index) => {
          const isStepBeforeCurrent = step.status !== order.status && 
            ["confirmed", "processing", "shipped", "completed"].indexOf(step.status) < 
            ["confirmed", "processing", "shipped", "completed"].indexOf(order.status);

          return (
            (isStepBeforeCurrent || isCurrent(step.status)) && (
              <TimelineStep
                key={index}
                step={step}
                order={order}
                isCompleted={isCompleted(step.status)}
                isCurrent={isCurrent(step.status)}
                isLastStep={index === steps.length - 1}
                icon={step.icon}
                description={step.description}
              />
            )
          );
        })}
        </ol>
        
    </section>
    )
}

export default AdminOrderDetails