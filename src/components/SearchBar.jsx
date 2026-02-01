import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ minimal = false }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [index, setIndex] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.BASE_URL + 'data/search_index.json')
            .then(res => res.json())
            .then(data => {
                setIndex(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load search index', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const matches = [];
        for (const item of index) {
            if (item.n.toLowerCase().includes(lowerQuery) || item.f.toLowerCase().includes(lowerQuery)) {
                matches.push(item);
                if (matches.length >= 20) break;
            }
        }
        setResults(matches);
        setIsOpen(true);
    }, [query, index]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const handleSelect = (item) => {
        setQuery('');
        setIsOpen(false);
        navigate(`/class/${item.p}/${item.n}`);
    };

    if (minimal) {
        return (
            <div className="relative w-full" ref={ref}>
                <div className="flex w-full flex-1 items-stretch rounded-md h-9 ring-1 ring-border-dark focus-within:ring-primary bg-surface-dark overflow-hidden transition-all">
                    <div className="text-slate-400 flex items-center justify-center pl-3">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                    </div>
                    <input
                        className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none focus:ring-0 text-sm px-3 text-white placeholder:text-slate-500 focus:outline-none"
                        placeholder="Search class..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setIsOpen(true)}
                    />
                    <div className="flex items-center pr-2">
                        <kbd className="hidden sm:inline-block rounded border border-border-dark bg-[#0d1117] px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400">Ctrl K</kbd>
                    </div>
                </div>
                { }
                {isOpen && results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-dark border border-border-dark rounded-lg shadow-xl overflow-hidden z-50">
                        <ul className="py-1 max-h-96 overflow-y-auto custom-scrollbar">
                            {results.map((item) => (
                                <SearchResultItem key={item.f} item={item} onSelect={handleSelect} />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="relative w-full z-20" ref={ref}>
            <label className="relative flex items-center w-full h-16 rounded-xl glass-panel search-glow transition-all duration-200 cursor-text group">
                <div className="pl-5 text-gray-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]">search</span>
                </div>
                <input
                    className="w-full h-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-lg px-4 font-mono focus:outline-none"
                    placeholder="Search classes, methods, fields..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
                <div className="pr-4 flex items-center gap-2">
                    <kbd className="hidden sm:inline-flex items-center h-8 px-3 rounded border border-white/10 bg-white/5 font-mono text-xs text-gray-400">
                        <span className="text-sm mr-1">⌘</span>K
                    </kbd>
                </div>
            </label>

            { }
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50">
                    <ul className="py-2 max-h-96 overflow-y-auto custom-scrollbar">
                        {results.map((item) => (
                            <SearchResultItem key={item.f} item={item} onSelect={handleSelect} />
                        ))}
                    </ul>
                </div>
            )}

            {isOpen && results.length === 0 && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-dark border border-border-dark rounded-xl shadow-xl p-4 text-center z-50 text-gray-400">
                    No results found
                </div>
            )}
        </div>
    );
}

function SearchResultItem({ item, onSelect }) {
    return (
        <li>
            <button
                onClick={() => onSelect(item)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 transition-colors group border-l-2 border-transparent hover:border-primary"
            >
                <div className={`flex items-center justify-center size-8 rounded-lg border ${item.t === 'interface' ? 'border-purple-500/20 bg-purple-500/10 text-purple-400' :
                    item.t === 'enum' ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400' :
                        'border-blue-500/20 bg-blue-500/10 text-blue-400'
                    }`}>
                    <span className="material-symbols-outlined text-[18px]">
                        {item.t === 'interface' ? 'code' : item.t === 'enum' ? 'view_api' : 'data_object'}
                    </span>
                </div>
                <div className="overflow-hidden">
                    <div className="text-sm font-bold text-gray-200 group-hover:text-primary transition-colors truncate font-mono">
                        {item.n}
                    </div>
                    <div className="text-xs text-gray-500 truncate font-mono">{item.p}</div>
                </div>
            </button>
        </li>
    );
}
