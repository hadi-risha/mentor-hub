import { BitcoinIconsArrowLeftFilled} from '../../assets/usersIcons/ProfileIcon';
import { FaCamera } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axiosInstance from '../../utils/users/axiosInstance'






const CreatePost = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [postData, setPostData] = useState({
    description: '',
    image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteImage, setDeleteImage] = useState(false); // Track if image should be deleted
  const [imageStatus, setImageStatus] = useState('unchanged'); // Tracks image status

    


  // Handler to update setPostData
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setPostData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  
  // image preview
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    
    if (file && file.type.match('image.*')) {  // validate image file type
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDeleteImage(false); // Reset delete flag if a new image is selected
      // setImageStatus('updated'); // Set status to updated if a new image is selected

    } else {
      alert("Please select a valid image file (jpg, png, etc.)");
    }

    // Reset the file input value to allow re-selection of the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = () => {
    setPostData(prevData => ({
      ...prevData,
      profilePic: '', // Clears existing image in the state
    }));
    setSelectedImage(null);
    setImagePreview(''); // Reset image preview

    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setDeleteImage(true); // Set delete flag
    // setImageStatus('deleted'); // Set status to deleted
  };


  const isValidNumber = (value: any) => /^[0-9]+$/.test(value); // Checks if the input is only numbers
  const isNotEmptyString = (value: any) => value.trim().length > 0; // Checks for non-empty input with non-space characters


  const handleSave = async() => {

    if (!postData.description ) {
      alert("Description required.");
      return;
    }
    if (!isNotEmptyString(postData.description)) {
      alert("Description required. Please provide a valid input.");
      return;
    }
    if (!selectedImage) {
      alert("Image required. Please provide a valid input.");
      return;
    }
   
    const formData = new FormData();
    formData.append("description", postData.description);
    formData.append("image", selectedImage ); // Add new image if selected

    console.log("selected image........", selectedImage);
      
    try {
      const response = await axiosInstance.post('/instructor/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("post created , response.data", response.data);
      alert("post created successfully!");
    //   navigate('/instructor/profile');

    } catch (error) {
      console.error("Error creating new post:", error);
      alert("Failed to create new post. Please try again.");
    }
  };
  

  return (
    <>
        <div className='w-screen h-auto bg-white overflow-x-hidden'>


            {/* white parent div */}
                
            <div className='ml-64 mt-10 mb-20 pl-10 pt-10 pb-10 bg-white w-8/12 h-auto  rounded-2xl shadow-2xl shadow-[#c3e3d7] flex flex-col'>

                <div className='flex items-center space-x-72'>
                    <Link to="/user/posts">
                        <div className='border border-gray-400 w-10 h-10 rounded-full cursor-pointer hover:border-blue-700 flex items-center justify-center hover:bg-[#3ee1a6] transition duration-300'>
                            <span className="text-black text-xl">←</span>
                        </div>
                    </Link>

                    <div className='text-black'> 
                        <h1 className='font-semibold text-xl font-serif'>Create New Post</h1>
                    </div> 
                </div> 


                <div className=' space-y-7 pt-14 flex-grow rounded-bl-3xl rounded-br-3xl'>   


                    <div className='flex w-full ml-64 h-10 space-x-14'>
                        <p className='w-2/12 text-black font-semibold text-sm font-serif'>Description</p>
                        <input 
                            type="text" 
                            placeholder='Description' 
                            name="description" 
                            value={postData.description} 
                            onChange={handleChange} 
                            className='border border-gray-300 rounded-md w-4/12 text-black text-sm placeholder:text-xs px-2' />
                    </div>
                    <hr className='ml-60 mr-48 text-black ' />


                    <div className='flex w-full ml-64 h-7 space-x-20'>
                    <div className='space-y-2'>
                        <p className='text-black font-bold text-sm font-serif'>Cover image</p>
                        {/* <p className='text-gray-500 font-normal text-xs'>Update your Photo</p> */}
                    </div>


                    <div className="flex space-x-8 items-center">
                        {/* Display Image Preview */}{/* Display profile picture if it exists */}
                        {postData.image || imagePreview ? (
                        <img src={imagePreview || postData.image}
                            alt="Profile Preview" className="ml-12 w-11 h-11 object-cover rounded-lg"
                        />
                        ) : (
                        <div
                            className="ml-14 w-11 h-11 flex items-center justify-center bg-black rounded-full cursor-pointer relative"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()} // Trigger file input on click
                        >
                            <FaCamera className="text-white" />
                        </div>
                        )}

                        {/* File Input */}
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef} // Attach ref
                        className="opacity-0 absolute inset-0 w-11 h-11 cursor-pointer"
                        />

                        {/* Delete Button */}
                        {(postData.image || imagePreview) && (
                        <button
                            onClick={handleDeleteImage}
                            className="text-red-500 font-bold text-xs"
                        > Delete </button>
                        )}
                    </div>


                    </div>
                    <hr className='ml-60 mr-48 text-black ' />


                </div>


                <button className='mt-14 ml-96 w-32 text-black border border-black bg-[#3ee1a6] hover:bg-primary-orange h-8 px-4 rounded-full mr-10' onClick={handleSave}>
                    Save
                </button>

            </div>

        </div>
    </>
  )
}

export default CreatePost;
