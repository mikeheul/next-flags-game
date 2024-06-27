"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
    return ( 
        <div className='text-4xl'>
            <Toaster />
        </div>
     );
}

export default ToastProvider;