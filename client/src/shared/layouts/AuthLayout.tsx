interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="h-dvh flex items-center justify-center container m-auto">
      <div className="w-[582px] bg-shades-light p-12">
        <header className="text-center">
          <img
            src="/logo-certisalud.webp"
            alt="Logo de Certisalud"
            width={364}
            height="auto"
            className="mx-auto"
          />
          <h1 className="text-primary-500 text-h4-semibold mb-1">{title}</h1>
          <h2 className="text-shades-dark text-h6-semibold opacity-90 mb-11">{subtitle}</h2>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};
