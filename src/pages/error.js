import React from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/navBar';
import Footer from '../components/footer';
import { motion } from 'framer-motion';

export default function Error({
    code = "404",
    title = "Nothing to see here!",
    message = "Ooops! It looks like Devy works hard, but couldn't find the page you're looking for. It might have been moved, deleted, or never existed.",
    showHomeButton = true
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-google-sans">
            <NavigationBar />

            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden min-h-[80vh]">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none"></div>

                <div className="text-center w-full max-w-6xl mx-auto z-10 grid md:grid-cols-2 gap-8 items-center">
                    {/* Mascot Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="order-first md:order-last flex justify-center items-center"
                    >
                        <div className="relative group">
                            {/* Glow effect behind mascot */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-green-400 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <img
                                src="/devy-whole.png"
                                alt="Devy Mascot"
                                className="relative w-full max-w-[280px] md:max-w-[400px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1"
                            />
                        </div>
                    </motion.div>

                    {/* Text Column */}
                    <div className="text-center md:text-left space-y-6 md:pl-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500 leading-tight select-none">
                                {code}
                            </h1>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                {title}
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg md:text-xl text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed font-medium"
                        >
                            {/* Render message with Devy logic if it is the default message */}
                            {message.includes("Devy") ? (
                                <>
                                    Ooops! It looks like <span className="text-blue-600 font-bold">Devy</span> couldn't find what you were looking for.
                                    <br />
                                    <span className="text-base mt-2 block">{message.replace("Ooops! It looks like Devy works hard, but couldn't find the page you're looking for.", "")}</span>
                                </>
                            ) : (
                                message
                            )}
                        </motion.p>

                        {showHomeButton && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                            >
                                <Link to="/">
                                    <button className="px-8 py-3.5 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[160px]">
                                        Back Home
                                    </button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}