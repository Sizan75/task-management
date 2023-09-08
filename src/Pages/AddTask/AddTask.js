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
                        <label className="block text-base">Task Title</label>

                        <input type="text" {...register("title", {
                            required: "Title is Required"
                        })} className="input input-bordered input-accent w-full max-w-xs " />

                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="block text-base">Description</label>

                        <input defaultValue={user?.email} type="textarea" {...register("description", {
                            required: "Description is Required"
                        })} className="input input-bordered input-accent w-full max-w-xs " />

                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="block text-base">Duue Date</label>

                        <input type="date" {...register("due-date", {
                            required: "due date is Required"
                        })} className="input input-bordered input-accent w-full max-w-xs " />

                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="block text-base">Priority Level</label>

                        <input type="text" {...register("priority-lvl", {
                            required: "Priority level is Required"
                        })} className="input input-bordered input-accent w-full max-w-xs " />

                    </div>

                    <input className='text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center' value="Add Task" type="submit" />
                        <Toaster/>
                </form>
            </div>
        </div>
    );
};

export default AddTask;