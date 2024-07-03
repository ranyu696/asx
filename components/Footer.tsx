import { Link as NextUILink } from "@nextui-org/link";
import { BsForwardFill } from "react-icons/bs";

import { Link } from "@/types"; // 确保从正确的位置导入类型

type FooterProps = {
  email: string;
  links: Link[];
};

export default function Footer({ email, links }: FooterProps) {
  // 按 order 字段排序链接
  const sortedLinks = [...links].sort(
    (a, b) => a.attributes.order - b.attributes.order,
  );

  return (
    <footer className="w-full flex items-center justify-center py-3">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-center space-x-4 mb-4">
          {sortedLinks.length > 0 ? (
            sortedLinks.map((link) => (
              <NextUILink
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
              </NextUILink>
            ))
          ) : (
            <p>No links available</p>
          )}
        </div>
        <div className="text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} 爱上性视频网站. All rights
          reserved.邮箱:{email}
        </div>
      </div>
    </footer>
  );
}
