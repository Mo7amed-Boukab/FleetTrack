import { Menu } from "lucide-react";

const Header = ({toggleSidebar, title, description}) => {

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500 hidden sm:block">{description}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
