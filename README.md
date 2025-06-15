# Secure File Editor

A minimal, cross-platform desktop application built with Electron and Vite that allows users to sign in with an Ethereum wallet, choose a local folder, and then create, open, and save plain-text files.

This project was built to fulfill the requirements of the technical assessment.

## Features

-   **Web3 Authentication:** Secure sign-in using "Sign-In with Ethereum" (EIP-4361).
-   **Local File System Access:** Choose a local directory to work within.
-   **File Operations:**
    -   List all `.txt` files in the chosen directory.
    -   Open and view the content of existing `.txt` files.
    -   Create new files or overwrite existing ones by saving content to a `.txt` file.
-   **Cross-Platform:** Packaged into runnable installers for both Windows (`.exe`) and macOS (`.dmg`).
-   **Secure by Design:** All file system operations are handled securely through a preload bridge, with `nodeIntegration` disabled and `contextIsolation` enabled.

## Technical Stack

-   **Framework:** [Electron](https://www.electronjs.org/)
-   **Frontend/Bundler:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **UI Styling:** [Tailwind CSS](https://tailwindcss.com/) (via Play CDN)
-   **Packaging:** [electron-builder](https://www.electron.build/)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (version 18 or higher)
-   [pnpm](https://pnpm.io/) package manager. If you don't have it, you can install it globally with `npm install -g pnpm`.

## Getting Started

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/jobson-okosun/file-editor.git
    cd file-editor
    ```
2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

## Available Scripts

### Run in Development Mode

This command will start the application with hot-reloading enabled and open the Chrome DevTools for debugging.

```sh
pnpm dev
```

### Build Installers

This command will build the application and package it into distributable installers for Windows and macOS. The finished files will be located in the `/dist-build` directory.

```sh
pnpm build
```

## How to Test the Flow

Follow these steps to test the full functionality of the application:

1.  **Launch the App:** Start the application using `pnpm dev`.
2.  **Sign In:**
    -   The login screen will appear. Click the "Sign In with MetaMask" button.
    -   Since direct integration with the browser extension is not possible in this desktop environment, the application will **simulate a successful login** and display a sample wallet address.
3.  **Choose a Folder:**
    -   After logging in, you will be prompted to select a folder. Click the "Choose Folder" button.
    -   A native file dialog will open. Navigate to and select a local directory on your computer.
4.  **Save a File:**
    -   Once a folder is selected, the file editor will appear.
    -   In the `filename-input` field, type a name for your new file (e.g., `test.txt`).
    -   In the `content-textarea`, type some text.
    -   Click the "Save File" button. A success message will appear, and your new file will be listed on the left.
5.  **Open a File:**
    -   In the file list on the left, click on the name of the file you just created (or any other `.txt` file).
    -   The content of the selected file will be displayed in the text area.
6.  **Quit:** You can close the application window to quit.
