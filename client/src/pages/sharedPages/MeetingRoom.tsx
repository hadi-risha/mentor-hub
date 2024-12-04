import React from 'react'
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import config from '../../config';

const MeetingRoomPage = () => {

    const { meetingRoomId } = useParams();// get the link
    

    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("userRole");

    console.log("id, name in rommm",id, name);
    console.log("role",role);
    
    


    const myMeeting = async (element: any) => {  // Element where Zego UI will be injected
        const appID = Number(config.zegeCloudAppId);
        // const appID = 516395584
        const serverSecret = config.zegeCloudServerSecret;
        // const serverSecret = 'aa898036c49ff20446f7dde85d98d26a'

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID, 
            serverSecret, 
            meetingRoomId!, 
            id!,   //give here userid, this actually the userId(just give date for random id)
            name!, //current user name
        ) 
        const zc = ZegoUIKitPrebuilt.create(kitToken);


        
        
        zc.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Copy Link',
                    url: `${config.frontendUrl}/user/meeting-room/${meetingRoomId}`,
                    // url: `http://localhost:3000/user/meeting-room/${meetingRoomId}`,
                }
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall
            },
            showScreenSharingButton: true,
        })
            
    }   

  return (
    // <div>
    //      <div ref={myMeeting} />
    //  </div>


        <div className='w-screen h-auto bg-white'>
          <div className="ml-28 mr-36 mt-2 mb-36 w-auto h-auto py-2 px-5 shadow-2xl grid grid-cols-3 gap-6">
              <div className='w-[1240px] h-[600px]' ref={myMeeting} />
          </div>
        </div>

  )
}

export default MeetingRoomPage





