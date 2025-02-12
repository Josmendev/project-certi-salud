interface Props {
  headerCard: "Listado" | "Registro";
  children: React.ReactNode;
  btnBack?: React.ReactNode;
  footerCard?: React.ReactNode;
}

export const Card: React.FC<Props> = ({ headerCard, btnBack, children, footerCard }) => {
  return (
    <>
      <header className="flex items-center justify-between border px-6 py-2.5 border-neutral-100 bg-shades-light">
        <p className="text-paragraph-semibold text-left">{headerCard}</p>
        {btnBack && <>{btnBack}</>}
      </header>
      <div className="px-8 py-8 bg-shades-light">{children}</div>
      {footerCard && <div>{footerCard}</div>}
    </>
  );
};
