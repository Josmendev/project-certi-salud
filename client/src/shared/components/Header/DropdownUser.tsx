import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserInformation } from "../../helpers/getUserInformation";
import { BASE_ROUTES } from "../../utils/constants";
import { handleApiError } from "../../utils/handleApiError";
import { showToast } from "../../utils/toast";
import { Button } from "../Button/Button";
import ClickOutside from "../ClickOutside";
import { Icon } from "../Icon";
import { Image } from "../Image";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    handleApiError(new Error("User is not defined"));
    return null;
  }

  const { userInformation } = getUserInformation(user);

  const handleLogout = async () => {
    await logout();
    showToast({
      title: "Sesión cerrada",
      description: "Se cerró la sesión de forma exitosa",
      type: "success",
    });
    navigate(BASE_ROUTES.PUBLIC.HOME);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black">{userInformation}</span>
          <span className="block text-xs">{user?.role.join(", ")}</span>
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
              <Link to="/dashboard" className="group header-dropdown-menu-item">
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
            onClick={handleLogout}
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
