import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import React, { useState } from "react";
import SharePreviewActionButton from "./SharePreviewActionButton";
import { ShareIcon } from "@sanity/icons";

export const sharePreviewAction: DocumentActionComponent = (
	props: DocumentActionProps,
) => {
	const [open, setOpen] = React.useState(false);
	if (props.type !== "post" && props.type !== "podcast") return null;
	return {
		label: "Share Preview",
		icon: () => <ShareIcon />,
		onHandle: () => setOpen(true),
		dialog: open && {
			type: "dialog",
			onClose: () => {
				setOpen(false);
			},
			content: (
				<>
					{open ? (
						<SharePreviewActionButton
							id={props.id as string}
							type={props.type as string}
							onClose={() => {
								setOpen(false);
								props.onComplete();
							}}
						/>
					) : null}
				</>
			),
		},
	};
};
