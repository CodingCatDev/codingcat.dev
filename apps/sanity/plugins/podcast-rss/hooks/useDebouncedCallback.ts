import { useEffect, useRef } from "react";

export default function useDebouncedCallback<A extends unknown[]>(
	callback: (...args: A) => void,
	delay: number,
): (...args: A) => void {
	const timeoutId = useRef<number | null>(null);
	const latest = useRef(callback);
	latest.current = callback;

	useEffect(
		() => () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
		},
		[],
	);

	return (...args: A) => {
		if (timeoutId.current) clearTimeout(timeoutId.current);
		timeoutId.current = window.setTimeout(() => latest.current(...args), delay);
	};
}
