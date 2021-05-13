import classNames from "classnames";
import Link from "next/link";

import AuthGuard from "../../hocs/AuthGuard";

interface NavbarLink {
  active?: boolean;
  path: string;
  text: string;
}
export interface NavbarProps {
  links: NavbarLink[];
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { links } = props;

  return (
    <AuthGuard>
      <header>
        <nav className="flex items-center justify-between h-12 border-b">
          <div className="flex items-center h-full space-x-6">
            <div className="flex items-center justify-center space-x-2">
              {/* <Image src="/mu.png" height={28} width={28} /> */}

              <p className="text-xl text-gray-700 ">
                <Link href="/">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>KCM</a>
                </Link>
              </p>
            </div>

            {links.map((link) => (
              <div
                className={classNames(
                  "flex items-center justify-center h-full text-gray-500 hover:text-gray-900 text-sm",
                  {
                    "pt-1 border-b-2 border-karns-blue font-medium text-gray-900":
                      link.active,
                  }
                )}
                key={link.text}
              >
                <Link href={link.path}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>{link.text}</a>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="w-8 h-8" type="button">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              {/* <Image
            className="rounded-full"
            width={32}
            height={32}
            src="/profile.jpg"
          /> */}
            </button>
          </div>
        </nav>
      </header>
    </AuthGuard>
  );
};

export default Navbar;
