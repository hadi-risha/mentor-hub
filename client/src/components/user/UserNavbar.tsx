import {IcBaselineMenu, GravityUiPerson, FlowbiteMessagesOutline, HugeiconsNotification01,
    IonPersonAddOutline, FluentPeopleCommunityAdd20Regular, LineiconsQuestionCircle
} from '../../assets/usersIcons/NavbarIcons'

const SideNavBar = () => {

  const userRole = localStorage.getItem('userRole')
  
  return (
    <div>
        <div className='bg-white w-24 h-screen'>
            <div className="space-x-6 space-y-11">
                
                <li className="flex items-center">
                  <a href={`/${userRole}/home`}>
                    <div className='mt-7 ml-6 w-12 h-12 flex items-center justify-center rounded-full bg-sky-blue'>
                        <IcBaselineMenu />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  {/* <a href="/profile"> */}
                  <a href={`/${userRole}/profile`}>
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-transparent'>
                        <GravityUiPerson />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  <a href={`/${userRole}/chat`}>
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-sky-blue'>
                        <FlowbiteMessagesOutline />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/blog">
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-sky-blue'>
                        <HugeiconsNotification01 />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/about">
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-sky-blue'>
                        <IonPersonAddOutline />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/contact">
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-sky-blue'>
                        <FluentPeopleCommunityAdd20Regular />
                    </div>
                  </a>
                </li>
                <li className="flex items-center">
                  <a href="/blog">
                    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-sky-blue'>
                        <LineiconsQuestionCircle />
                    </div>
                  </a>
                </li>
            </div>
        </div>
    </div>
  )
}

export default SideNavBar
