import { useRouter } from "next/router";

import Navbar, { NavbarProps } from "./Navbar";

const navbarProps: NavbarProps = {
  links: [{ path: "/chart", text: "Chart" }],
};

export default function Header() {
  const { pathname } = useRouter();

  // Set which (if any) is active
  navbarProps.links = navbarProps.links.map((link) => ({
    ...link,
    active: pathname.toLowerCase().startsWith(link.path.toLowerCase()),
  }));

  return (
    <header className="px-6 bg-white">
      <Navbar {...navbarProps} />
    </header>
  );
}
