import SearchBar from '../components/SearchBar';
import PackageBrowser from '../components/PackageBrowser';

export default function HomePage() {
    return (
        <div className="flex-grow flex flex-col items-center pt-20 pb-16 px-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <div className="w-full max-w-4xl flex flex-col items-center text-center gap-8 relative z-10">
                {/* Badge */}
                <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium font-mono mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Latest Mappings for 1.21.11 Available
                </div>

                {/* Headlines */}
                <div className="flex flex-col gap-4 max-w-3xl animate-slide-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        Navigate Minecraft Mappings with Precision
                    </h1>
                    <p className="text-lg text-gray-400 md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                        The ultimate high-performance browser for Minecraft development. Instant search, deep usage analysis, and rich bytecode introspection.
                    </p>
                </div>

                {/* Command Palette Search */}
                <div className="w-full max-w-2xl mt-8 relative group animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <SearchBar minimal={false} />
                </div>

                {/* Stats Minimalist */}
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mt-8 text-sm text-gray-400 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-primary">data_object</span>
                        <span><span className="text-white font-mono font-bold">28,000+</span> Classes Indexed</span>
                    </div>
                    <div className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></div>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-primary">functions</span>
                        <span><span className="text-white font-mono font-bold">150k+</span> Methods Mapped</span>
                    </div>
                </div>

                {/* Package Browser Section */}
                <div className="w-full mt-12 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                    <PackageBrowser startPath="net.minecraft" />
                </div>
            </div>

            {/* Feature Grid Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20 mt-12 border-t border-border-dark/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon="bolt"
                        title="Instant Search"
                        desc="Zero-latency lookup across all major mapping versions. Powered by a custom indexing engine optimized for Java signatures."
                        delay="0.3s"
                    />
                    <FeatureCard
                        icon="account_tree"
                        title="Deep Usages"
                        desc="Trace references through the entire inheritance tree. Visualize overrides, implementations, and call hierarchies in one view."
                        delay="0.4s"
                    />
                    <FeatureCard
                        icon="code"
                        title="Rich Signatures"
                        desc="Full descriptor analysis and bytecode previews. See the raw descriptors alongside readable Java signatures."
                        delay="0.5s"
                    />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc, delay }) {
    return (
        <div className="glass-panel rounded-xl p-8 flex flex-col gap-4 transition-all duration-300 group hover:border-primary/40 hover:bg-white/5 animate-slide-up" style={{ animationDelay: delay }}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[28px]">{icon}</span>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                    {desc}
                </p>
            </div>
        </div>
    );
}
