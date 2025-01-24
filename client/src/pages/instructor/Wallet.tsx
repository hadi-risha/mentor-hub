import { TypcnUserAdd, PrimeStarFill, AntDesignMessageFilled, FluentNotepadEdit16Filled, TeenyiconsUpSolid, SolarMenuDotsBold, MaterialSymbolsAdd } from '../../assets/usersIcons/ProfileIcons'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/users/axiosInstance'
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import Modal from '../../utils/users/userLogout';
import wallet from '../../assets/userImgs/wallet.png'
import wallet2 from '../../assets/userImgs/wallet2.png'
import debit from '../../assets/userImgs/debit.png'
import credit from '../../assets/userImgs/credit.png'






interface ISession {
    _id: string;
    title: string;
    introduction: string;
    duration: string;
    fee: number;
    descriptionTitle: string;
    description: string;
    timeSlots: string[];
    coverImage: {
        key: string | '';
        url: string | '';
      };
    instructorId: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    
}

interface WalletData {
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  transactionStatus: string; // 'Credit' or 'Credited'
  fee: string;
}


const Wallet = () => {
    const navigate = useNavigate();  // Initialize navigate function

    const [loading, setLoading] = useState(true);

    const [walletData, setWalletData] = useState<WalletData[]>([]);
    const [totalCreditedAmount, setTotalCreditedAmount] = useState(0);
    const [debitedAmount, setDebitedAmount] = useState(0);
    const [balance, setBalance] = useState(0);

    const [profileData, setProfileData] = useState({
        role: '',
        firstName: '',
        lastName: '',
        occupation: '',
        currentInstitution: '',
        profilePic: '',
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await axiosInstance.get('/student/profile');
                console.log("res profile data in wallet------------",res.data);
                console.log("res profile data in wallet------------",res.data.message);

                const {
                    role,
                    firstName, 
                    lastName,
                    occupation, 
                    currentInstitution, 
                    profilePicUrl } = res.data;

                setProfileData({
                    role: role || '',
                    firstName: firstName || '',
                    lastName: lastName || '',
                    occupation: occupation || '',
                    currentInstitution: currentInstitution || '',
                    profilePic: profilePicUrl || '',
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
        fetchProfile();
    }, []);



    useEffect(() => {
    setLoading(true);
    async function fetchWallet() {
        try {
            const response = await axiosInstance.get(`/instructor/wallet`);
            console.log("response.data.walletData", response.data.walletData);

            // Initialize sums
            let totalCreditedAmount = 0;
            let debitedAmount = 0;

            // Transform the data and calculate sums
            const transformedData: WalletData[] = response?.data?.walletData.map((item: any) => {
                const isCredited = item.status === "booked" || item.status === "completed";
                const fee = item.sessionId.fee;

                // Update sums
                totalCreditedAmount += fee;
                // if (isCredited) {
                //     totalCreditedAmount += fee;
                // } 
                 if (item.status === "cancelled") {
                    debitedAmount += fee;
                }

                // Return the transformed object
                return {
                    firstName: item.studentId.firstName,
                    lastName: item.studentId.lastName,
                    date:
                        isCredited
                            ? item.createdAt
                            : item.cancelledDate || item.updatedAt, // Use cancelledDate for cancelled, fallback to updatedAt
                    transactionStatus: isCredited ? "Credited" : "Debited",
                    fee: fee
                };
            });

            // Set the calculated totals and transformed data to state
            setWalletData(transformedData);
            setTotalCreditedAmount(totalCreditedAmount);
            setDebitedAmount(debitedAmount);
            setBalance(totalCreditedAmount - debitedAmount); // Balance is credited - debited

            setLoading(false);
        } catch (error) {
            console.error("Error fetching wallet data:", error);
        }
    }
    fetchWallet();
}, []);




  

  return (
    <>
      <div className='w-screen h-auto bg-white'>


        <div className='mx-auto mt-10 w-8/12  rounded-lg shadow border border-gray-300'>

            <div className='flex w-full bg-[#C6989F]' >
                <div className='w-8/12   flex'>
                    <div className='px-10  h-28 flex items-center justify-start space-x-2' >
                        <p className='text-white text-3xl font-serif'>Wallet</p>
                        <img src={wallet2} className="w-20 h-20 object-cover rounded-full" alt="Instructor Profile"/>
                    </div>
                </div>
            
                <div className='px-10  flex-grow h-28  flex items-center justify-start space-x-2 border border-gray-200'>
                    <div className='px-14 bg-gray-50 h-20 flex flex-col justify-center items-center border border-gray-500'>
                        <p className='text-navy-blue font-semibold'>Balance</p>
                        <p className='text-2xl font-serif text-green-700'>₹ {balance}</p>
                    </div>
                </div>
            </div>

           


            <div className='w-full h-96 bg-gray-200 flex p-6 space-x-7'>
                <div className='w-3/12 space-y-3 pt-2'>
                    <div className='px-14 py-12 bg-gray-50 h-20 flex flex-col justify-center items-center border border-gray-500'>
                        <img src={credit} className="w-12 h-12 object-cover" alt="credit amount"/>
                        <p className='text-lg  text-gray-700'>₹ {totalCreditedAmount}</p>
                    </div>
                    <div className='px-14 py-12 bg-gray-50 h-20 flex flex-col justify-center items-center border border-gray-500'>
                        <img src={debit} className="w-20 h-20 object-cover" alt="debited amount"/>
                        <p className='text-lg  text-gray-700'>₹ {debitedAmount}</p>
                    </div>
                    <div className='px-14 py-12 bg-gray-50 h-20 flex flex-col justify-center items-center border border-gray-500'>
                        <p className='text-navy-blue font-semibold'>Balance</p>
                        <p className='text-lg text-gray-700'>₹ {balance}</p>
                    </div>
                </div>

                <div className='w-full  pt-2'>
                    <div className="max-h-80 overflow-auto">
                        <table className='min-w-full bg-white border-collapse'>
                        <thead>
                            <tr className='bg-navy-blue text-white font-light'>
                            <th className='px-4 py-2 border border-gray-300  text-left'>From</th>
                            <th className='px-4 py-2 border border-gray-300 text-left'>Date</th>
                            <th className='px-4 py-2 border border-gray-300 text-left'>Transaction Status</th>
                            <th className='px-4 py-2 border border-gray-300 text-left'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {walletData.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border border-gray-300">
                                        {item.firstName} {item.lastName}
                                    </td>
                                    
                                    <td className="px-4 py-2 border border-gray-300">
                                        {item.transactionStatus === 'Debited'
                                            ? new Date(item.updatedAt).toLocaleDateString()
                                            : new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        {item.transactionStatus}
                                    </td>
                                    <td 
                                    className={`px-4 py-2 border border-gray-300 ${
                                        item.transactionStatus === 'Credited' 
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                    >
                                        {item.fee}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>

                      
            </div>


        </div>
      </div>
    </>
  )
}

export default Wallet;
