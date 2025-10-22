
import {faBell, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Header=()=>{
  return(
    <div className="w-full py-4 ">
      <div className="flex  gap-2 justify-end items-center px-6 ">
        <FontAwesomeIcon
          icon={faBell}
          className="text-gray-400 text-3xl"
        />
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-gray-600 text-[40px]"
        />
      </div>
    </div>
  )
}
export default Header