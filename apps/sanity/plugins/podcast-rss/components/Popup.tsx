import { Box, Dialog } from "@sanity/ui";
import type { ReactNode } from "react";

interface IPopup {
	onClose: () => void;
	children: ReactNode;
	isOpen: boolean;
}

const Popup = ({ onClose, children, isOpen }: IPopup) =>
	isOpen ? (
		<Dialog
			header="Episode Picker"
			id="podcast-rss-episode-picker"
			onClose={onClose}
			zOffset={1000}
			width={1}
		>
			<Box padding={4}>{children}</Box>
		</Dialog>
	) : null;

export default Popup;
