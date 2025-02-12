import { Navigate, useLocation, useParams } from "react-router";

export const UserDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();

  // Verifico que la URL sea "/admin/users/:id" sin más segmentos
  if (location.pathname != `/admin/users/${id}`) {
    return <Navigate to="/admin/users" replace />;
  }

  // Verifico si solo es un número
  if (isNaN(Number(id))) return <Navigate to="/admin/users" replace />;

  return <div>UserDetailPage</div>;
};
