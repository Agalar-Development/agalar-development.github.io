import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ClassPage() {
    const { package: pkg, className } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('members');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setLoading(true);
        setError(null);
        const path = `/data/classes/${pkg.replace(/\./g, '/')}/${className}.json`;

        fetch(path)
            .then(res => {
                if (!res.ok) throw new Error('Class not found');
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [pkg, className]);

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error) return <div className="p-20 text-center text-red-400">{error}</div>;

    const fields = data.members.filter(m => !m.includes('('));
    const methods = data.members.filter(m => m.includes('('));

    return (
        <div className="flex flex-1 w-full max-w-[1400px] mx-auto">
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumbs */}
                <nav className="flex flex-wrap items-center gap-2 mb-4 text-sm font-mono">
                    {pkg.split('.').map((part, i, arr) => (
                        <span key={i} className="flex items-center gap-2">
                            <Link
                                to={`/package/${arr.slice(0, i + 1).join('.')}`}
                                className="text-slate-500 dark:text-slate-400 hover:text-primary hover:underline"
                            >
                                {part}
                            </Link>
                            <span className="text-slate-600">/</span>
                        </span>
                    ))}
                    <span className="text-slate-900 dark:text-white font-bold bg-primary/10 px-2 py-0.5 rounded text-primary">{className}</span>
                </nav>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border-dark">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded border ${data.type === 'interface' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                data.type === 'enum' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }`}>
                                <span className="material-symbols-outlined text-[24px]">
                                    {data.type === 'interface' ? 'code' : data.type === 'enum' ? 'view_api' : 'data_object'}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white">{data.name}</h1>
                            <span className="rounded-full border border-border-dark bg-surface-dark px-2.5 py-0.5 text-xs font-medium text-slate-500">
                                1.21.11
                            </span>
                        </div>
                        <div className="font-mono text-sm md:text-base text-slate-400 break-all leading-relaxed">
                            <span className="text-code-keyword">public {data.type}</span>
                            <span className="text-white font-bold ml-2">{data.name}</span>
                            <span className="text-gray-500 ml-2">({data.fqn})</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mt-6 border-b border-border-dark">
                    <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} count={data.members.length}>Members</TabButton>
                    <TabButton active={activeTab === 'usages'} onClick={() => setActiveTab('usages')} count={data.usages ? data.usages.length : 0}>Usages</TabButton>
                </div>

                {/* Content */}
                {activeTab === 'members' && (
                    <div className="py-6 space-y-8 animate-fade-in">
                        {/* Fields */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Fields</h3>
                                <span className="h-px flex-1 bg-border-dark"></span>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                {fields.map((f, i) => <MemberCard key={i} signature={f} />)}
                            </div>
                        </div>

                        {/* Methods */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Methods</h3>
                                <span className="h-px flex-1 bg-border-dark"></span>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                {methods.map((m, i) => <MemberCard key={i} signature={m} />)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'usages' && (
                    <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                        {data.usages && data.usages.map((u) => (
                            <Link key={u} to={`/class/${u.substring(0, u.lastIndexOf('.'))}/${u.substring(u.lastIndexOf('.') + 1)}`}
                                className="group p-4 rounded-md border border-border-dark bg-surface-dark/40 hover:bg-surface-dark hover:border-primary/50 transition-all">
                                <div className="text-sm font-bold text-slate-200 group-hover:text-primary font-mono mb-1 truncate">
                                    {u.substring(u.lastIndexOf('.') + 1)}
                                </div>
                                <div className="text-xs text-slate-500 font-mono truncate">{u.substring(0, u.lastIndexOf('.'))}</div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Sidebar Structure */}
            <aside className="hidden xl:flex flex-col w-72 border-l border-border-dark bg-[#0d1117] pt-6 px-4 sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Structure</h3>
                <div className="flex flex-col gap-1 overflow-y-auto h-full pr-2 pb-10">
                    {fields.map((f, i) => <SidebarItem key={i} signature={f} icon="data_object" color="text-yellow-500" />)}
                    {methods.map((m, i) => <SidebarItem key={i} signature={m} icon="function" color="text-primary" />)}
                </div>
            </aside>
        </div>
    );
}

function TabButton({ children, active, onClick, count }) {
    return (
        <button
            onClick={onClick}
            className={`relative px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${active
                ? 'text-primary border-primary'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700'}`}
        >
            {children}
            {count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-primary/10 text-primary' : 'bg-surface-dark text-slate-500'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function MemberCard({ signature }) {
    // Determine icon and colors
    const isPrivate = signature.includes('private');
    const isProtected = signature.includes('protected');
    const isPublic = signature.includes('public');

    // Parse signature for colorization
    const { output } = useMemo(() => parseSignature(signature), [signature]);

    return (
        <div className="group relative flex items-center gap-4 rounded-md border border-transparent dark:border-border-dark/50 dark:bg-surface-dark/40 bg-white px-4 py-3 hover:border-slate-600 hover:bg-surface-dark transition-all">
            <div className="flex-shrink-0" title={isPrivate ? "Private" : isPublic ? "Public" : "Protected"}>
                <span className={`material-symbols-outlined text-[18px] ${isPrivate ? 'text-slate-500' :
                    isProtected ? 'text-yellow-500' :
                        'text-green-500'
                    }`}>
                    {isPrivate ? 'lock' : isProtected ? 'shield_lock' : 'public'}
                </span>
            </div>
            <div className="flex-1 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {output}
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
        </div>
    );
}

function SidebarItem({ signature, icon, color }) {
    // Extract name
    const tokens = signature.split(/(\s+|[(){},;<>]|\[|\])/g).filter(t => t.length > 0 && !/^\s+$/.test(t));
    let name = "Unknown";
    // Heuristic: Name is usually the token before the first '(' for methods, or before ';' for fields
    // But we need to skip modifiers and type.
    // Simplified: Find the identifier before '(' or the last identifier.

    // Better regex extraction
    if (signature.includes('(')) {
        const match = signature.match(/(\w+)\s*\(/);
        if (match) name = match[1];
    } else {
        const match = signature.match(/(\w+)\s*;?$/);
        if (match) name = match[1]; // Should capture name if at end
        else {
            // split by space and take last
            const parts = signature.replace(';', '').split(' ');
            name = parts[parts.length - 1];
        }
    }

    return (
        <a href="#" className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-surface-dark truncate transition-colors group">
            <span className={`material-symbols-outlined text-[14px] ${color}`}>{icon === 'function' ? 'functions' : icon}</span>
            <span className="truncate group-hover:text-primary transition-colors">{name}</span>
        </a>
    )
}

function parseSignature(sig) {
    const keywords = ['public', 'private', 'protected', 'static', 'final', 'abstract', 'native', 'synchronized', 'transient', 'volatile', 'strictfp', 'class', 'interface', 'enum', 'void', 'extends', 'implements'];
    const primitives = ['int', 'boolean', 'char', 'byte', 'short', 'long', 'float', 'double'];

    const tokens = sig.split(/(\s+|[(){},;<>]|\[|\])/g).filter(t => t.length > 0);
    const output = [];

    tokens.forEach((token, i) => {
        if (/^\s+$/.test(token)) {
            output.push(<span key={i}>{token}</span>);
        } else if (keywords.includes(token)) {
            output.push(<span key={i} className="text-code-keyword">{token}</span>);
        } else if (primitives.includes(token)) {
            output.push(<span key={i} className="text-orange-400">{token}</span>);
        } else if (/[(){},;<>]|\[|\]/.test(token)) {
            output.push(<span key={i} className="text-slate-500">{token}</span>);
        } else if (token.includes('.')) {
            output.push(<span key={i} className="text-code-class">{token.split('.').pop()}</span>);
        } else if (/^[A-Z]/.test(token)) {
            output.push(<span key={i} className="text-code-class">{token}</span>);
        } else {
            // Likely the method or field name
            output.push(<span key={i} className="text-code-method font-semibold text-slate-200">{token}</span>);
        }
    });

    return { output };
}
