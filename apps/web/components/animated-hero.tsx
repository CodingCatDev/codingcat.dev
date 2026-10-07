"use client";

import { useState } from "react";
import {
	FaReact,
	FaVuejs,
	FaAngular,
	FaNodeJs,
	FaPython,
} from "react-icons/fa";
import { SiSvelte } from "react-icons/si";
import {
	SiNextdotjs,
	SiTypescript,
	SiJavascript,
	SiOpenai,
	SiTensorflow,
} from "react-icons/si";
import { RiGeminiFill } from "react-icons/ri";
import AJHeadphones from "@/components/icons/aj-headphones";
import AJPrimary from "@/components/icons/aj-primary-alt";

const icons = [
	{ icon: <FaReact />, name: "React" },
	{ icon: <FaVuejs />, name: "Vue.js" },
	{ icon: <FaAngular />, name: "Angular" },
	{ icon: <SiSvelte />, name: "Svelte" },
	{ icon: <FaNodeJs />, name: "Node.js" },
	{ icon: <SiNextdotjs />, name: "Next.js" },
	{ icon: <SiTypescript />, name: "TypeScript" },
	{ icon: <SiJavascript />, name: "JavaScript" },
	{ icon: <FaPython />, name: "Python" },
	{ icon: <SiOpenai />, name: "OpenAI" },
	{ icon: <SiTensorflow />, name: "TensorFlow" },
	{ icon: <RiGeminiFill />, name: "Gemini" },
];

export default function AnimatedHero() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="relative w-full h-[500px] overflow-hidden">
			<div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-4">
				{icons.map((item, index) => (
					<div
						key={item.name}
						className="flex items-center justify-center text-6xl text-muted-foreground/20"
						style={{
							animation: `float 6s ease-in-out infinite`,
							animationDelay: `${index * 0.5}s`,
						}}
					>
						{item.icon}
					</div>
				))}
			</div>
			<div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
				<div
					className="relative bg-background/80 p-8 rounded-lg"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<h1 className="text-4xl font-bold tracking-tighter text-center sm:text-5xl md:text-6xl">
						CodingCat.dev Podcast
					</h1>
					<p className="max-w-[600px] text-center text-muted-foreground md:text-xl/relaxed">
						Purrfect Podcast for Web Developers
					</p>
					<div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
						<AJHeadphones
							cls={`absolute w-24 h-24 -top-12 -right-12 transition-transform duration-500 ${isHovered ? "translate-x-32 -translate-y-32 rotate-45" : "animate-paw-one"}`}
						/>
						<AJPrimary
							cls={`absolute w-24 h-24 -bottom-12 -left-12 transition-transform duration-500 ${isHovered ? "-translate-x-32 translate-y-32 -rotate-45" : "animate-paw-two"}`}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
