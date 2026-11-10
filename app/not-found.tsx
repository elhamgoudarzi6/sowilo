"use client";

import Link from 'next/link';
import Lottie from "lottie-react";
import data from "@/public/404.json";

const NotFoundPage = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center text-center p-8">
            <Lottie animationData={data} className="w-60 h-40" loop />
            <h2 className="text-2xl font-semibold text-gray-600 mb-6">صفحه مورد نظر یافت نشد!</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                متاسفیم، صفحه‌ای که دنبالش بودید وجود ندارد.
            </p>
            <Link href="/" className="bg-(--primary-color) hover:bg-(--primary-color) text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out">
                بازگشت به صفحه اصلی
            </Link>
        </div>
    );
};

export default NotFoundPage;

