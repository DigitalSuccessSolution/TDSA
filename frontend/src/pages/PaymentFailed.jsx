import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCcw, Home } from 'lucide-react';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const txnid = searchParams.get('txnid');

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/20 blur-[80px] rounded-full" />
                
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle size={40} className="text-red-500" />
                    </div>
                    
                    <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">
                        Payment Failed
                    </h1>
                    <p className="text-zinc-400 mb-8">
                        Something went wrong during the transaction. Please try again or contact support.
                    </p>
                    
                    <div className="bg-black/40 rounded-2xl p-4 mb-8 border border-white/5">
                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Transaction ID</div>
                        <div className="text-sm font-mono text-zinc-200">{txnid || 'N/A'}</div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <RefreshCcw size={18} />
                            <span>Try Again</span>
                        </button>
                        <Link 
                            to="/"
                            className="w-full py-4 bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all"
                        >
                            <Home size={18} />
                            <span>Back Home</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
