import React, { useEffect, useState } from 'react'
import { getBaseUrl } from '../utils/baseURL';
import { Link } from 'react-router-dom'
import { useGetOrderByIdQuery } from '../redux/features/orders/orderApi';
import { FaAngleDoubleLeft } from "react-icons/fa";
import TimelineStep from './TimelineStep';
import { useParams } from 'react-router-dom';

const PaymentSuccess = () => {
   const [orders, setOrder] = useState(null);
   const{id} = useParams();
   console.log('useparams',id);
   const { data: order, error, isLoading } = useGetOrderByIdQuery(id);
  useEffect(() => {
    if (order) {
      setOrder(order);
    }
  }, [order]); 

    if(!orders) {return <div>Loading...</div>}

    const isCompleted = (status) => {
        const statuses = ["confirmed", "processing", "shipped", "completed"];
        return statuses.indexOf(status) < statuses.indexOf(orders.status)
    }

    const isCurrent = (status) => orders.status ===  status;
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
    <section className='section__container rounded p-6'>
        <Link to="/dashboard" className='text-red-500 px-1 underline'><FaAngleDoubleLeft />Move to dashboard </Link>
        <h2 className='text-2xl font-semibold  mt-4 mb-4'>Order {orders?.status}</h2>
        <p className='mb-4'>Order Id: {orders?._id}</p>
        <p className='mb-8'>Status: {orders?.status}</p>

        <ol className='sm:flex items-center relative'>
        {steps.map((step, index) => {
          const isStepBeforeCurrent = step.status !== orders.status && 
            ["confirmed", "processing", "shipped", "completed"].indexOf(step.status) < 
            ["confirmed", "processing", "shipped", "completed"].indexOf(orders.status);

          return (
            (isStepBeforeCurrent || isCurrent(step.status)) && (
              <TimelineStep
                key={index}
                step={step}
                order={orders}
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

export default PaymentSuccess