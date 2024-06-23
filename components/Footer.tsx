// components/Footer.tsx
import { Link } from "@nextui-org/link";
import { BsForwardFill } from "react-icons/bs";

interface FooterProps {
  links: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
        target: boolean;
      };
    }[];
  };
  email: string;
}

export default function Footer({ links, email }: FooterProps) {
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-center space-x-4 mb-4">
          {links.data.map((link) => (
            <Link
              key={link.id}
              className="group relative inline-flex items-center overflow-hidden rounded border border-current px-8 py-3 text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
              href={link.attributes.url}
              rel="noopener noreferrer"
              target={link.attributes.target ? "_blank" : "_self"}
            >
              <span className="absolute -start-full transition-all group-hover:start-4">
                <BsForwardFill />
              </span>
              <span className="text-sm font-medium transition-all group-hover:ms-4">
                {link.attributes.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} 爱上性视频网站. All rights
          reserved.邮箱:{email}
        </div>
      </div>
    </footer>
  );
}
