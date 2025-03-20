export const getDNI = (word: string) => {
  const regexNumber = /\d/g;
  const indexInitialDNI = word.match(regexNumber)?.join("");
  if (indexInitialDNI) {
    const result = indexInitialDNI.slice(0, 8);
    return result;
  }
  return "No se encontró un DNI";
};
