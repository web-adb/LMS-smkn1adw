import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
    return (
        <div className="h-full border-r flex flex-col overflow-auto bg-white shadow-sm">
            <div className="p-6 flex items-center space-x-2">
                <Logo />
                <div className="text-left font-sans">
                    <p className="text-xs font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-yellow-500 leading-tight">Open</p>
                    <p className="text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 leading-tight">your Eyes</p>
                    <p className="text-xs font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-yellow-500 leading-tight">To Technology</p>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    );
};
