import { Outlet, Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen">
            {}
            <header className="sticky top-0 z-50 border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
                <div className="flex justify-center w-full">
                    <div className="flex items-center justify-between w-full max-w-[1400px] px-6 py-3">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center size-8 bg-primary/20 rounded-lg border border-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">dataset</span>
                            </div>
                            <span className="text-white text-lg font-bold tracking-tight">Mapping Tree</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#">Documentation</a>
                            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#">API</a>
                            <a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="#">GitHub</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            {!isHome && (
                                <div className="hidden sm:block w-64">
                                    <div className="relative">
                                        <SearchBar minimal />
                                    </div>
                                </div>
                            )}

                            <button className="hidden sm:flex bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all items-center gap-2">
                                <span>v1.21.11</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-500"></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col">
                <Outlet />
            </main>

            {}
            <footer className="border-t border-border-dark bg-background-dark py-12 px-6 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-6 bg-primary/20 rounded-md border border-primary/20 text-primary">
                            <span className="material-symbols-outlined text-[16px]">dataset</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-300">Mapping Tree</span>
                        <span className="text-sm text-gray-600 ml-2">© 2024</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <a className="text-gray-500 hover:text-white transition-colors text-sm" href="#">Privacy</a>
                        <a className="text-gray-500 hover:text-white transition-colors text-sm" href="#">Terms</a>
                        <a className="text-gray-500 hover:text-white transition-colors text-sm" href="#">Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
