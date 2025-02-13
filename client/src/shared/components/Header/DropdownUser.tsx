import { useContext, useState } from "react";
import { Link } from "react-router";
import { ADMIN_USERS_ROUTES } from "../../../features/admin-users/utils/constants";
import { AuthContext } from "../../contexts/AuthContext";
import { BASE_ROUTES } from "../../utils/constants";
import { Button } from "../Button/Button";
import ClickOutside from "../ClickOutside";
import { Icon } from "../Icon";
import { Image } from "../Image";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const URL_PROFILE =
    "/" + BASE_ROUTES.PRIVATE.ADMIN + "/" + ADMIN_USERS_ROUTES.USERS + "/" + user?.userId;

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black">Fernando Minchola</span>
          <span className="block text-xs">UX/UI Designer</span>
        </span>

        <span className="header-profile-img">
          <Image
            src="/rey-misterio.webp"
            alt="Current User Logged"
            className="w-full h-full object-cover"
          />
        </span>

        <Icon.Chevron
          color="#1C2434"
          strokeWidth={1.5}
          className={`opacity-85 ml-auto ${dropdownOpen && "rotate-180"}`}
        />
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div className={`shadow-default header-dropdown-user`}>
          <ul className="header-dropdown-menu">
            <li>
              <Link to={URL_PROFILE} className="group header-dropdown-menu-item">
                <Icon.User
                  color="#1C2434"
                  strokeWidth={1.5}
                  className="header-dropdown-menu-icon"
                />
                <p className="header-dropdown-menu-paragraph">Mi perfil</p>
              </Link>
            </li>
          </ul>

          <Button
            title="Logout"
            name="btn-logout"
            id="btn-logout"
            type="button"
            classButton="btn-base py-4 pl-4 gap-3.5 group"
            iconLeft={
              <Icon.Logout
                color="#1C2434"
                strokeWidth={1.5}
                className="header-dropdown-menu-icon"
              />
            }
          >
            <p className="header-dropdown-menu-paragraph">Cerrar sesión</p>
          </Button>
        </div>
      )}

      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
