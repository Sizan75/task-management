import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthProvider';

const AddTask = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const imageHostKey = process.env.REACT_APP_img_key;
    const {user}=useContext(AuthContext)
    


    const handleAddTask = data => {
        const image = data.photo[0];
        const formData = new FormData();
        formData.append('image', image);

        const url = `https://api.imgbb.com/1/upload?&key=${imageHostKey}`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgdata => {
                const tasks = {
                    image: imgdata.data.url,
                    name: data.name,
                    email: data.email
                }
                fetch('https://task-manager-server-nine.vercel.app/tasks', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(tasks)
                })
                .then(res=>res.json())
                .then(result=>{
                    if(result.acknowledged){
                        toast.success('task added')
                    }
                })
            })
    }


    return (
        <div className='w-3/4 mx-auto'>
            <h1 className='text-3xl font-semibold'>Add Task</h1>
            <div className='mx-auto'>
                <form onSubmit={handleSubmit(handleAddTask)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Task Name</label>

                        <input type="text" {...register("name", {
                            required: "Name is Required"
                        })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />

                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>

                        <input defaultValue={user?.email} type="email" {...register("email", {
                            required: "Email is Required"
                        })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />

                    </div>
                    <div className="form-control w-full max-w-xs">
                    <label className="block mb-2 text-sm font-medium text-gray-900" >Task Image</label>

                        <input type="file" {...register("photo", {
                            required: "Photo is Required"
                        })} className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" />

                    </div>

                    <input className='text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center' value="Add Task" type="submit" />
                        <Toaster/>
                </form>
            </div>
        </div>
    );
};

export default AddTask;