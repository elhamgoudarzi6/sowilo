// "use client";

// import Lottie from "lottie-react";
// import { useEffect, useState } from "react";

// const Loading = () => {
//     const [data, setData] = useState(null);

//     useEffect(() => {
//         fetch("/Loading.json").then((res) => res.json()).then(setData);
//     }, []);

//     if (!data) return null;

//     return (
//         <div className="h-screen flex justify-center items-center">
//             <Lottie animationData={data} className="w-40 h-40" loop />
//         </div>
//     );
// }
// export default Loading;


"use client";

import Lottie from "lottie-react";
import data from "@/public/Loading.json";

const Loading = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <Lottie animationData={data} className="w-40 h-40" loop />
        </div>
    );
};

export default Loading;

// "use client";

// import { useEffect, useState } from "react";
// import Lottie from "lottie-react";
// import data from "@/public/Loading.json";

// export default function LoadingGate({ children }: { children: React.ReactNode }) {
//     const [ready, setReady] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setReady(true);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, []);

//     if (!ready) {
//         return (
//             <div className="h-screen flex justify-center items-center">
//                 <Lottie animationData={data} className="w-40 h-40" loop />
//             </div>
//         );
//     }

//     return <>{children}</>;
// }









