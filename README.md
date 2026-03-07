# Obsidian Canvas Images As Links

Adds the ability to set a link on images in Obsidian Canvas. You can then double click on the image to open the link.

https://github.com/user-attachments/assets/388c6279-040b-47ca-8a6b-ac6692dd1481

## Features

- Right click on a image shows 2 new menu options: `Set link` and `Open link`
- New command `Set link of selected canvas node`. Configure your own shortcut in Obsidian settings.
- Supports multiple types of links:
    - Web: `https://example.com`
    - Files: `file://C:/Users/abc/Desktop/phenomenal.mkv`
    - Obsidian: `obsidian://open?vault=myvault&file=Testing.canvas`
 
The configured link will be displayed underneath the image like this:
<img width="950" height="667" alt="image" src="https://github.com/user-attachments/assets/f6875390-982d-42ea-8b5c-eb8058303f47" />



## Manually installing the plugin
- Head over to [the latest release](https://github.com/jffaust/obsidian-canvas-images-as-links/releases/latest) and download `main.js`, `styles.css`, `manifest.json`
- Copy those files to your vault `VaultFolder/.obsidian/plugins/canvas-images-as-links/`.
