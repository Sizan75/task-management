import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthProvider';

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [signUpError, setSignUPError] = useState('')
    const { createUser, updateUser } = useContext(AuthContext);
    const imageHostKey = process.env.REACT_APP_img_key;
    // const [createdUserEmail, setCreatedUserEmail]= useState('')

    const navigate = useNavigate()
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'

       
    
    const handleSignUp = (data) => {
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
            const users = {
                image: imgdata.data.url,
                userName: data.name,
                email: data.email,
                bio: data.bio
            }

            localStorage.setItem('user', JSON.stringify(users))
        })

        setSignUPError('');
        createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                toast('User Created Successfully.')
                
                const userInfo = {
                    userName: data.name,
                    profilePicture: result.data.url,
                    email: data.email,
                    bio: data.bio
                }
                updateUser(userInfo)
                    .then(() => {
                        localStorage.setItem('users', JSON.stringify(userInfo))             
                     
                    })
                    .catch(err => console.log(err));
            })
            .catch(error => {
                console.log(error)
                setSignUPError(error.message)
            });
    }

    return (
        <div className='h-[800px] flex justify-center items-center'>
            <div className='w-96 p-7'>
                <h2 className='text-xl text-center'>Sign Up</h2>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">User Name</span></label>
                        <input type="text" {...register("name", {
                            required: "Name is Required"
                        })} className="input input-bordered input-success w-full max-w-xs" />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Image</span></label>
                        <input type="file" {...register("photo", {
                            required: "Photo is Required"
                        })}className= "block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" />
                        {errors.image && <p className='text-red-500'>{errors.image.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input type="email" {...register("email", {
                            required: true
                        })} className="input input-bordered input-success w-full max-w-xs" />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input type="password" {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be 6 characters long" },
                            pattern: { value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/, message: 'Password must have uppercase, number and special characters' }
                        })} className="input input-bordered input-success w-full max-w-xs" />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Bio</span></label>
                        <input type="textarea" {...register("bio", {
                            
                        })} className="input input-bordered input-success w-full max-w-xs" />
                        {errors.bio && <p className='text-red-500'>{errors.bio.message}</p>}
                    </div>

                    <input className='btn btn-success w-full mt-4' value="Sign Up" type="submit" />
                    {signUpError && <p className='text-red-600'>{signUpError}</p>}
                </form>
                <p>Already have an account <Link className='text-secondary' to="/login">Please Login</Link></p>
               
               
            </div>
        </div>
    );
};

export default SignUp;