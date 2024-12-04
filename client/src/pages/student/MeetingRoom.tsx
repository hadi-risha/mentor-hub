import  { useEffect, useState } from 'react';
import axiosInstance from '../../utils/users/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import config from '../../config';


const StdMeetingRoom = () => {
  const { meetingRoomId } = useParams();// get the link

  const [profileData, setProfileData] = useState({
    stdId: '',
    email: '',
    role: '',
    firstName: '',
    lastName: '',
  });

  const [isMeetingRoomMissing, setIsMeetingRoomMissing] = useState(false);
// Check if meetingRoomId is missing
useEffect(() => {
    if (!meetingRoomId) {
      setIsMeetingRoomMissing(true);
    }
  }, [meetingRoomId]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axiosInstance.get(`/student/profile`);
        const { id, email, role,  firstName, lastName, profilePicUrl } = res.data;
        console.log("res.data",res.data);
        
        console.log("_id of user in rooooooooom", id, email);
        

        setProfileData({
            stdId: id || '',
          email: email || '',
          role: role || '',
          firstName: firstName || '',
          lastName: lastName || '',
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);



  const myMeeting = async (element: HTMLDivElement) => {  //basically this is the - element where zc inject ui
    const appID = Number(config.zegeCloudAppId);
    // const appID = 516395584
    const serverSecret = config.zegeCloudServerSecret;
    // const serverSecret = 'aa898036c49ff20446f7dde85d98d26a'

    if (isNaN(appID)) {
        console.error("Invalid appID");
        return;
    }

    console.log("appID,serverSecret",appID,serverSecret);

    const roomId = meetingRoomId || 'defaultRoomId';
    


    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        // appID, 
        // serverSecret, 
        // roomId || roomLocalId , 
        // profileData.stdId || studentLocalId,
        // `${profileData.firstName} ${profileData.lastName}` || stdName, //current user name
            appID, 
            serverSecret, 
            roomId, 
            'randomuserId',   //give here userid, this actually the userId(just give date for random id)
            "studentName", //current user name
    ) 

    console.log("kitToken---------------------------------------------------------------------------",kitToken);
    
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    console.log("zc============================================================================", zc);
    
    zc.joinRoom({
        container: element,
        sharedLinks: [
            {
                name: 'Copy Link',
                url: `${config.frontendUrl}/student/meeting-room/${meetingRoomId}`

            } 
        ],
        scenario: {
            // mode: ZegoUIKitPrebuilt.OneONoneCall
            mode: ZegoUIKitPrebuilt.OneONoneCall, // Use VideoCall for group meetings

        },
        showScreenSharingButton: true,
    })
        
} 



if (isMeetingRoomMissing) {
    return <div>Meeting Room ID is missing!</div>;
  }


  return (
    <>
      <div className='w-screen h-auto bg-white'>
      {/* <p className='ml-28 mt-14 text-black text-2xl font-serif'>Explore Available Sessions</p> */}


        {/* ALL SESSIONS */}
        {/* <div className="ml-28 mr-36 mt-8 mb-36 h-auto py-16 px-5 shadow-2xl grid grid-cols-3 gap-6"> */}
            <div ref={myMeeting} />
        {/* </div> */}

      </div>
    </>
  )
}

export default StdMeetingRoom;