import { useState, useEffect } from 'react'

const SALT = "fg_2026_modern_secure_99"

interface Generation {
    machineId: string
    key: string
    timestamp: number
}

export default function LicenseGenerator() {
    const [machineId, setMachineId] = useState('')
    const [licenseKey, setLicenseKey] = useState('')
    const [copied, setCopied] = useState(false)
    const [history, setHistory] = useState<Generation[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('license_history')
        if (saved) {
            try {
                setHistory(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to load history', e)
            }
        }
    }, [])

    const generateKey = async (mid: string) => {
        if (!mid.trim()) {
            setLicenseKey('')
            return
        }

        try {
            const encoder = new TextEncoder()
            const keyData = encoder.encode(SALT)
            const msgData = encoder.encode(mid.trim())

            const cryptoKey = await window.crypto.subtle.importKey(
                'raw',
                keyData,
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            )

            const signature = await window.crypto.subtle.sign(
                'HMAC',
                cryptoKey,
                msgData
            )

            const hashArray = Array.from(new Uint8Array(signature))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

            const raw = hashHex.substring(0, 12)
            const formatted = `${raw.substring(0, 4)}-${raw.substring(4, 8)}-${raw.substring(8, 12)}`

            setLicenseKey(formatted)
            setCopied(false)

            // Add to history if it doesn't already exist as the latest
            if (history[0]?.machineId !== mid.trim()) {
                const newGen = { machineId: mid.trim(), key: formatted, timestamp: Date.now() }
                const newHistory = [newGen, ...history].slice(0, 10) // Keep last 10
                setHistory(newHistory)
                localStorage.setItem('license_history', JSON.stringify(newHistory))
            }
        } catch (err) {
            console.error('Error generating key:', err)
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem('license_history')
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                    <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-200">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Generate Key</h2>
                        <p className="text-gray-500 font-medium">Create activation keys based on Machine ID</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="relative group">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Input Machine ID</label>
                        <input
                            type="text"
                            value={machineId}
                            onChange={(e) => {
                                setMachineId(e.target.value)
                                generateKey(e.target.value)
                            }}
                            placeholder="F742FA06-DF86-A54A-A541-7B2FA297AD93"
                            className="w-full px-6 py-5 bg-gray-100/50 border-2 border-transparent rounded-3xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all font-mono text-lg shadow-inner"
                        />
                    </div>

                    <div className="min-h-[140px] flex items-center justify-center relative overflow-hidden rounded-[2rem] bg-gray-50/50 border border-gray-100">
                        {licenseKey ? (
                            <div className="w-full p-8 flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                        {licenseKey}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(licenseKey)}
                                        className={`p-3 rounded-2xl transition-all ${copied
                                            ? 'bg-green-500 text-white scale-110'
                                            : 'bg-white text-blue-600 hover:shadow-lg active:scale-95 border border-gray-100'
                                            }`}
                                    >
                                        {copied ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Securely Generated Key</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 opacity-20">
                                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-sm font-bold uppercase tracking-widest">Waiting for ID</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-amber-50/50 rounded-3xl border border-amber-100">
                        <div className="p-2 bg-amber-100 rounded-xl">
                            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-[11px] text-amber-800/80 font-semibold leading-relaxed">
                            This environment utilizes production-grade SALT. All generated keys are unique to the provided Machine ID and compliant with the 2026 security standard.
                        </p>
                    </div>
                </div>
            </div>

            {history.length > 0 && (
                <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 animate-in fade-in duration-700">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Recent Generations</h3>
                        <button
                            onClick={clearHistory}
                            className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                        >
                            Clear History
                        </button>
                    </div>
                    <div className="space-y-3">
                        {history.map((item, idx) => (
                            <div
                                key={item.timestamp}
                                className="group flex items-center justify-between p-4 bg-white/40 hover:bg-white rounded-2xl border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                                onClick={() => handleCopy(item.key)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:bg-blue-600 group-hover:scale-125 transition-all" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{item.machineId}</p>
                                        <p className="font-mono text-sm font-bold text-gray-700 tracking-widest">{item.key}</p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
