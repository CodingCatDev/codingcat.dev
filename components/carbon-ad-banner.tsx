"use client";
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
	return <div className="flex justify-center my-2" ref={reference} />;
}
