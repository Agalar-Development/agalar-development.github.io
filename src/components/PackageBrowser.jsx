import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PackageBrowser({ startPath = 'net.minecraft' }) {
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/data/package_tree.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setTree(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load package tree', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="w-full h-64 flex justify-center items-center rounded-xl border border-primary/20 bg-primary/5">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="w-full h-64 flex justify-center items-center rounded-xl border border-red-500/20 bg-red-500/5 text-red-400">
            Failed to load package data
        </div>
    );

    if (!tree) return null;

    // Navigate to startPath
    const parts = startPath ? startPath.split('.') : [];
    let currentNode = tree;

    if (parts.length > 0) {
        for (const part of parts) {
            if (currentNode && currentNode[part]) {
                currentNode = currentNode[part];
            } else if (currentNode && currentNode._sub && currentNode._sub[part]) {
                currentNode = currentNode._sub[part];
            } else {
                // Fallback to root or handle missing path gracefully
                // specific logic for 'net.minecraft' structure if needed
                currentNode = null;
                break;
            }
        }
    }

    // If startPath failed, maybe show root? Or show error? 
    // Let's fallback to root content if node not found, or just empty.
    if (!currentNode) {
        // Trying to be robust: if net.minecraft not found (e.g. slight data mismatch), show root
        currentNode = tree;
    }

    const subpackages = currentNode._sub ? Object.keys(currentNode._sub) : Object.keys(currentNode).filter(k => !k.startsWith('_'));
    const classes = currentNode._classes || [];

    // Sort items: subpackages first, then classes
    // Limit to show only a reasonable amount if too many?
    // For Home Page, maybe just show subpackages to encourage drilling down?
    // User said: "navigate through folder base directly from start"

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">folder_open</span>
                <h2 className="text-xl font-bold text-white">Browse Packages</h2>
                <span className="text-gray-500 text-sm font-mono ml-2">({startPath})</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subpackages.map(name => (
                    <Link
                        key={name}
                        to={`/package/${startPath ? startPath + '.' + name : name}`}
                        className="group p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined text-[20px] text-yellow-500/80 group-hover:text-yellow-500">folder</span>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-primary truncate">{name}</span>
                    </Link>
                ))}

                {classes.slice(0, 12).map(cls => ( // Limit classes on home page to avoid clutter
                    <Link
                        key={cls.f}
                        to={`/class/${startPath}/${cls.n}`}
                        className="group p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all flex items-center gap-3"
                    >
                        <div className={`p-1 rounded ${cls.t === 'interface' ? 'text-purple-400 bg-purple-500/10' :
                                cls.t === 'enum' ? 'text-yellow-400 bg-yellow-500/10' :
                                    'text-blue-400 bg-blue-500/10'
                            }`}>
                            <span className="material-symbols-outlined text-[16px]">
                                {cls.t === 'interface' ? 'code' : cls.t === 'enum' ? 'view_api' : 'data_object'}
                            </span>
                        </div>
                        <span className="text-sm font-mono text-gray-400 group-hover:text-primary truncate">{cls.n}</span>
                    </Link>
                ))}

                {classes.length > 12 && (
                    <Link
                        to={`/package/${startPath}`}
                        className="group p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white"
                    >
                        <span>+ {classes.length - 12} more files</span>
                    </Link>
                )}
            </div>

            {subpackages.length === 0 && classes.length === 0 && (
                <div className="text-center text-gray-500 py-8 border border-white/5 rounded-lg bg-white/5">
                    Empty package
                </div>
            )}
        </div>
    );
}
