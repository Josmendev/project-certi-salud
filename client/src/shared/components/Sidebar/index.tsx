/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { getRolesOfUser } from "../../helpers/getRolesForDescription";
import {
  ADMIN_USERS_ROUTES,
  BASE_ROUTES,
  INFO_REQUIRED_ROUTES,
  REGISTER_CERTIFICATE_ROUTES,
  REPORT_CERTIFICATE_ROUTES,
} from "../../utils/constants";
import { Button } from "../Button/Button";
import { Icon } from "../Icon";
import { Image } from "../Image";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const {
    PRIVATE: { DASHBOARD, ADMIN, INFO_REQUIRED, REGISTER_CERTIFICATE, REPORTS },
  } = BASE_ROUTES;

  const { USERS, ROLES, STAFF } = ADMIN_USERS_ROUTES;
  const { PATIENTS, DISEASES } = INFO_REQUIRED_ROUTES;
  const { CERTIFICATES, TYPE_CERTIFICATES } = REGISTER_CERTIFICATE_ROUTES;
  const { REPORT: REPORT_CERTIFICATE } = REPORT_CERTIFICATE_ROUTES;

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target))
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`sidebar lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="sidebar-header">
        <NavLink to={"/" + DASHBOARD}>
          <Image src="/logo-certisalud.webp" alt="Logo" className="sidebar-header-logo" />
        </NavLink>

        <Button
          ref={trigger}
          title="Close Sidebar"
          id="btn-close-sidebar"
          classButton="block lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          ariaControls="sidebar"
          ariaExpanded={sidebarOpen}
          iconLeft={<Icon.ArrowLeft color="#C1CDE0" strokeWidth={1.5} />}
        />
      </div>

      {/* <!-- SIDEBAR HEADER --> */}

      <div className="sidebar-menu">
        {/* <!-- Sidebar Menu --> */}
        <nav className="navbar">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="navbar-title mt-12 lg:mt-0">MENU</h3>

            <ul className="menu">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to={"/" + DASHBOARD}
                  className={`menu-list text-bodydark2 group ${
                    pathname.includes("dashboard") && "bg-graydark !text-white"
                  }`}
                >
                  <Icon.DashBoard color="#C1CDE0" />
                  <p>Inicio</p>
                </NavLink>
              </li>
              {/* <!-- Menu Item Dasboard --> */}

              {/* <!-- Menu Item Adm. Usuarios --> */}
              {getRolesOfUser(user)?.includes("Administrador") && (
                <SidebarLinkGroup
                  activeCondition={pathname === `/${ADMIN}` || pathname.includes(ADMIN)}
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`menu-list relative group ${
                            (pathname === `/${ADMIN}` || pathname.includes(ADMIN)) && "bg-graydark"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (sidebarExpanded) handleClick();
                            else setSidebarExpanded(true);
                          }}
                        >
                          <p className="text-paragraph-s-medium">ADMIN. USUARIOS</p>
                          <Icon.Chevron
                            color="#C1CDE0"
                            className={`ml-auto ${open && "rotate-180"}`}
                          />
                        </NavLink>

                        {/* <!-- Dropdown Menu Start --> */}
                        <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                          <ul className="flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to={`/${ADMIN}/${USERS}`}
                                className={"group relative menu-item "}
                              >
                                {({ isActive }) => (
                                  <>
                                    <Icon.User
                                      className={"menu-item-icon " + (isActive && "stroke-white")}
                                    />
                                    <p className={"menu-item-text " + (isActive && "text-white")}>
                                      Usuarios
                                    </p>
                                  </>
                                )}
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${ADMIN}/${ROLES}`}
                                className={"group relative menu-item "}
                              >
                                {({ isActive }) => (
                                  <>
                                    <Icon.Role
                                      className={"menu-item-icon " + (isActive && "stroke-white")}
                                    />
                                    <p className={"menu-item-text " + (isActive && "text-white")}>
                                      Roles
                                    </p>
                                  </>
                                )}
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${ADMIN}/${STAFF}`}
                                className={"group relative menu-item"}
                              >
                                {({ isActive }) => (
                                  <>
                                    <Icon.Staff
                                      className={"menu-item-icon " + (isActive && "stroke-white")}
                                    />
                                    <p className={"menu-item-text " + (isActive && "text-white")}>
                                      Personal
                                    </p>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Adm. Usuarios --> */}

              {/* <!-- Menu Item Informacion Requerida --> */}
              {getRolesOfUser(user)?.includes("Administrador") && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === `/${INFO_REQUIRED}` || pathname.includes(INFO_REQUIRED)
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`menu-list relative group ${
                            (pathname === `/${INFO_REQUIRED}` ||
                              pathname.includes(INFO_REQUIRED)) &&
                            "bg-graydark"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (sidebarExpanded) handleClick();
                            else setSidebarExpanded(true);
                          }}
                        >
                          <p className="text-paragraph-s-medium">INFORMACION REQUER.</p>
                          <Icon.Chevron
                            color="#C1CDE0"
                            className={`ml-auto ${open && "rotate-180"}`}
                          />
                        </NavLink>

                        {/* <!-- Dropdown Menu Start --> */}
                        <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                          <ul className="flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to={`/${INFO_REQUIRED}/${PATIENTS}`}
                                className={"group relative menu-item"}
                              >
                                {({ isActive }) => (
                                  <>
                                    <Icon.Patient
                                      className={"menu-item-icon " + (isActive && "stroke-white")}
                                    />
                                    <p className={"menu-item-text " + (isActive && "text-white")}>
                                      Pacientes
                                    </p>
                                  </>
                                )}
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to={`/${INFO_REQUIRED}/${DISEASES}`}
                                className={"group relative menu-item"}
                              >
                                {({ isActive }) => (
                                  <>
                                    <Icon.Disease
                                      className={"menu-item-icon " + (isActive && "stroke-white")}
                                    />
                                    <p className={"menu-item-text " + (isActive && "text-white")}>
                                      Enfermedades (cie-10)
                                    </p>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Informacion Requerida --> */}

              {/* <!-- Menu Item Certificados --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === `/${REGISTER_CERTIFICATE}` || pathname.includes(REGISTER_CERTIFICATE)
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`menu-list relative group ${
                          (pathname === `/${REGISTER_CERTIFICATE}` ||
                            pathname.includes(REGISTER_CERTIFICATE)) &&
                          "bg-graydark"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) handleClick();
                          else setSidebarExpanded(true);
                        }}
                      >
                        <p className="text-paragraph-s-medium">REGISTRO CERTIFICADOS</p>
                        <Icon.Chevron
                          color="#C1CDE0"
                          className={`ml-auto ${open && "rotate-180"}`}
                        />
                      </NavLink>

                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to={`/${REGISTER_CERTIFICATE}/${CERTIFICATES}`}
                              className={"group relative menu-item"}
                            >
                              {({ isActive }) => (
                                <>
                                  <Icon.Certificate
                                    className={"menu-item-icon " + (isActive && "stroke-white")}
                                  />
                                  <p className={"menu-item-text " + (isActive && "text-white")}>
                                    Certificados
                                  </p>
                                </>
                              )}
                            </NavLink>
                          </li>
                          {getRolesOfUser(user)?.includes("Administrador") && (
                            <li>
                              <NavLink
                                to={`/${REGISTER_CERTIFICATE}/${TYPE_CERTIFICATES}`}
                                className={"group relative menu-item"}
                              >
                                {({ isActive }) => (
                                  <>
                                    <Icon.TypeCertificate
                                      className={"menu-item-icon " + (isActive && "stroke-white")}
                                    />
                                    <p className={"menu-item-text " + (isActive && "text-white")}>
                                      Tipo de Certificado
                                    </p>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Certificados --> */}

              {/* <!-- Menu Item Reporte de Certificados --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === `/${REPORT_CERTIFICATE}` || pathname.includes(REPORT_CERTIFICATE)
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`menu-list relative group ${
                          (pathname === `/${REPORT_CERTIFICATE}` ||
                            pathname.includes(REPORT_CERTIFICATE)) &&
                          "bg-graydark"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) handleClick();
                          else setSidebarExpanded(true);
                        }}
                      >
                        <p className="text-paragraph-s-medium">REPORTE CERTIFICADOS</p>
                        <Icon.Chevron
                          color="#C1CDE0"
                          className={`ml-auto ${open && "rotate-180"}`}
                        />
                      </NavLink>

                      {/* <!-- Dropdown Menu Start --> */}
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to={`/${REPORTS}/${REPORT_CERTIFICATE}`}
                              className={"group relative menu-item"}
                            >
                              {({ isActive }) => (
                                <>
                                  <Icon.ReportCertificate
                                    className={"menu-item-icon " + (isActive && "stroke-white")}
                                  />
                                  <p className={"menu-item-text " + (isActive && "text-white")}>
                                    Reporte Certificado
                                  </p>
                                </>
                              )}
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Reporte de Certificados --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
