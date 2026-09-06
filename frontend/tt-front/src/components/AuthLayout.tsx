import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  title: string;
  copy: string;
  benefits: { mark: string; label: string }[];
  children: ReactNode;
};

function AuthLayout({ title, copy, benefits, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <Link className="brand" to="/login">
          <span className="brand-mark">✓</span>
          <span>Taskflow</span>
        </Link>
        <div className="auth-copy">
          <h1>{title}</h1>
          <p>{copy}</p>
          <div className="auth-benefits">
            {benefits.map((item) => (
              <span key={item.label}>
                <b>{item.mark}</b> {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>
      <main className="auth-panel">{children}</main>
    </div>
  );
}

export default AuthLayout;
