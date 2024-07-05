"use client"
import { useEffect, useRef } from "react";

export default function CarbonAdBanner() {
    const reference = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!reference.current) return;
        reference.current.innerHTML = "";
        const s = document.createElement("script");
        s.id = "_carbonads_js";
        s.src = `//cdn.carbonads.com/carbon.js?serve=CW7DCKJJ&placement=codingcatdev&format=cover`;
        reference.current.appendChild(s);
    }, []);
    return (
        <section className="flex flex-col mt-10 mb-10">
            <h2 className="mb-4 text-2xl font-bold">Ads</h2>
            <hr className="border-accent-2" />
            <div className="my-12 ">
                <div className="p-4 grid gap-6 md:p-6 grid-flow-col auto-cols-[1fr]">
                    <div className="flex justify-center my-2" ref={reference} />
                </div>
            </div>
            <hr className="border-accent-2" />
        </section>
    )
}