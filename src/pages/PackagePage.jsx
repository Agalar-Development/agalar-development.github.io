import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PackagePage() {
    const params = useParams();
    const packagePath = params['*'] || '';
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(import.meta.env.BASE_URL + 'data/package_tree.json')
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

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error || !tree) return <div className="p-20 text-center text-red-400">Failed to load package tree: {error}</div>;

    const parts = packagePath ? packagePath.split('.') : [];

    let currentNode = null;
    if (parts.length === 0) {
        currentNode = tree;
    } else {
        let node = tree;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === 0) {
                if (node && node[part]) {
                    node = node[part];
                } else {
                    node = null;
                    break;
                }
            } else {
                if (node && node._sub && node._sub[part]) {
                    node = node._sub[part];
                } else {
                    node = null;
                    break;
                }
            }
        }
        currentNode = node;
    }

    if (!currentNode && packagePath) {
        return <div className="p-20 text-center text-red-400">Package not found: {packagePath}</div>;
    }

    const subpackages = currentNode._sub ? Object.keys(currentNode._sub) : Object.keys(currentNode).filter(k => !k.startsWith('_'));
    const classes = currentNode._classes || [];

    const displaySubpackages = parts.length === 0
        ? Object.keys(tree).filter(k => !k.startsWith('_'))
        : Object.keys(currentNode._sub || {});

    return (
        <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex flex-wrap items-center gap-2 mb-6 text-sm font-mono">
                <Link to="/package" className="text-slate-400 hover:text-primary hover:underline">root</Link>
                {parts.map((part, i) => (
                    <span key={i} className="flex items-center gap-2">
                        <span className="text-slate-600">/</span>
                        <Link
                            to={`/package/${parts.slice(0, i + 1).join('.')}`}
                            className={`hover:text-primary hover:underline ${i === parts.length - 1 ? 'text-primary font-bold' : 'text-slate-400'}`}
                        >
                            {part}
                        </Link>
                    </span>
                ))}
            </nav>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-primary">
                    <span className="material-symbols-outlined text-[28px]">folder</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    {parts.length > 0 ? parts[parts.length - 1] : 'Root Packages'}
                </h1>
            </div>

            {displaySubpackages.length > 0 && (
                <section className="mb-8">
                    <div className="flex items-center gap-2 px-2 mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subpackages ({displaySubpackages.length})</h3>
                        <span className="h-px flex-1 bg-border-dark"></span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {displaySubpackages.map(name => (
                            <Link
                                key={name}
                                to={`/package/${packagePath ? packagePath + '.' + name : name}`}
                                className="group p-4 rounded-lg border border-border-dark bg-surface-dark/40 hover:bg-surface-dark hover:border-primary/50 transition-all flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-[20px] text-yellow-500">folder</span>
                                <span className="text-sm font-medium text-slate-200 group-hover:text-primary truncate">{name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {classes.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 px-2 mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Classes ({classes.length})</h3>
                        <span className="h-px flex-1 bg-border-dark"></span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {classes.map(cls => (
                            <Link
                                key={cls.f}
                                to={`/class/${packagePath}/${cls.n}`}
                                className="group p-4 rounded-lg border border-border-dark bg-surface-dark/40 hover:bg-surface-dark hover:border-primary/50 transition-all flex items-center gap-3"
                            >
                                <div className={`p-1.5 rounded border ${cls.t === 'interface' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
                                    cls.t === 'enum' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' :
                                        'border-blue-500/30 bg-blue-500/10 text-blue-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-[18px]">
                                        {cls.t === 'interface' ? 'code' : cls.t === 'enum' ? 'view_api' : 'data_object'}
                                    </span>
                                </div>
                                <span className="text-sm font-mono font-medium text-slate-200 group-hover:text-primary truncate">{cls.n}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {displaySubpackages.length === 0 && classes.length === 0 && (
                <div className="text-center text-slate-500 py-12">This package is empty</div>
            )}
        </div>
    );
}
