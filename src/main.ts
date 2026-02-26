import { App, ItemView, Modal, Plugin, Setting } from "obsidian";
import { CanvasNode } from "obsidian-typings";

export default class CanvasImageLinkPlugin extends Plugin {
	async onload() {
		// Register the double-click event on the window to capture clicks in the canvas
		this.registerDomEvent(
			window,
			"dblclick",
			this.tryOpenSelectedNodeLink.bind(this),
		);

		this.registerEvent(
			this.app.workspace.on("canvas:node-menu", (menu, node) => {
				if (!isValidNodeType(node)) return;

				menu.addItem((item) => {
					item.setTitle("Set link")
						.setIcon("link")
						.onClick(() => {
							new EditLinkModal(this.app, node).open();
						});
				});

				const link = getNodeLink(node);
				if (link) {
					menu.addItem((item) => {
						item.setTitle("Open link")
							.setIcon("external-link")
							.onClick(() => {
								window.open(sanitizeLink(link));
							});
					});
				}
			}),
		);

		this.addCommand({
			id: "canvas-set-node-link",
			name: "Set link of selected canvas node",
			checkCallback: (checking: boolean) => {
				const node = this.getSelectedCanvasNode();
				if (!node) return false;
				if (!isValidNodeType(node)) return false;

				if (!checking) {
					new EditLinkModal(this.app, node).open();
				}
				return true;
			},
		});
	}

	tryOpenSelectedNodeLink() {
		const node = this.getSelectedCanvasNode();
		if (!node) return;
		if (!isValidNodeType(node)) return;

		let link = getNodeLink(node);
		if (link) {
			window.open(sanitizeLink(link));
		}
	}

	getSelectedCanvasNode(): any | null {
		const canvasView = this.app.workspace.getActiveViewOfType(ItemView);
		if (canvasView?.getViewType() === "canvas") {
			const canvas = (canvasView as any).canvas;
			// Get all currently selected nodes
			const selection = Array.from(canvas.selection);

			if (selection.length !== 1) {
				return null;
			}
			const node = selection[0];
			return node;
		}
		return null;
	}
}

function isValidNodeType(node: any): boolean {
	return node?.unknownData?.type === "file" || "file" in node;
}

function getNodeLink(node: any): string {
	if ("unknownData" in node) {
		if ("link" in node.unknownData) {
			return node.unknownData.link;
		}
	}
	return "";
}

function sanitizeLink(link: string): string {
	if (/^[a-z][a-z0-9+.-]*:/i.test(link)) {
		return link;
	}
	return `https://${link}`;
}

class EditLinkModal extends Modal {
	constructor(app: App, node: any) {
		super(app);
		this.setTitle("Set node link");
		this.modalEl.addClass("canvas-node-link-modal");

		let link = getNodeLink(node);

		const onSubmit = () => {
			this.close();
			node.setData({ link });
		};

		new Setting(this.contentEl).setName("Link").addText((text) => {
			text.setValue(link).onChange((value) => {
				link = value;
			});
			text.inputEl.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					onSubmit();
				}
			});
		});

		new Setting(this.contentEl).addButton((btn) =>
			btn.setButtonText("Submit").setCta().onClick(onSubmit),
		);
	}
}
