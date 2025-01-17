export const TransformRole =  role => {
  const { createdAt, updatedAt, ...roleData } = role;
  return roleData;
}