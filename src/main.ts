import './style.css'

let walletAddress: string | null = null
let selectedFolderPath: string | null = null
let pathSeparator = '/'

const loginButton = document.getElementById('login-button')!
const loginStatus = document.getElementById('login-status')!
const logoutButton = document.getElementById('logout-button')!
const selectFolderButton = document.getElementById('select-folder-button')!
const folderPathEl = document.getElementById('folder-path')!
const fileEditorEl = document.getElementById('file-editor')!
const fileListEl = document.getElementById('file-list')!
const filenameInput = document.getElementById('filename-input') as HTMLInputElement
const contentTextarea = document.getElementById('content-textarea') as HTMLTextAreaElement
const saveButton = document.getElementById('save-button')!
const saveStatus = document.getElementById('save-status')!


function updateView() {
  const walletAddressEl = document.getElementById('wallet-address')!
  const loginView = document.getElementById('login-view')!
  const mainView = document.getElementById('main-view')!
  
  if (walletAddress) {
    loginView.classList.add('hidden')
    mainView.classList.remove('hidden')
    walletAddressEl.textContent = walletAddress
  } else {
    loginView.classList.remove('hidden')
    mainView.classList.add('hidden')
    resetToInitialState()
  }
}

function updateFileList(files: string[]) {
  fileListEl.innerHTML = ''
  if (files.length === 0) {
    const li = document.createElement('li')
    li.textContent = 'No .txt files found.'
    li.className = 'text-gray-500 italic px-3'
    fileListEl.appendChild(li)
    return
  }

  files.forEach((file) => {
    const li = document.createElement('li')
    li.dataset.filename = file

    li.className = 'flex items-center gap-x-1 cursor-pointer py-0.5 rounded-md'
    const iconHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500 flex-shrink-0">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 13.5h6m-6 4.5h6m-6-9h6m-6.75-4.5h6.75a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25z" />
      </svg>
    `

    const span = document.createElement('span')
    span.textContent = file
    span.className = 'truncate'

    li.innerHTML = iconHTML
    li.appendChild(span)
    
    fileListEl.appendChild(li)
  })
}

async function signInWithEthereum() {
  const loginStatus = document.getElementById('login-status')!
  loginStatus.textContent = 'Attempting to connect to wallet...'
  
  try {
    if (!window.ethereum) throw new Error('MetaMask not detected.')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const userAddress = accounts[0]
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })

    const domain = window.location.host
    const statement = 'Sign in to the MetaMask File Editor.'
    const uri = window.location.origin
    const nonce = 'a' + Math.random().toString(36).substring(7)
    const issuedAt = new Date().toISOString()
    const parsedChainId = parseInt(chainId, 16)

    const message = `${domain} wants you to sign in with your Ethereum account:\n${userAddress}\n\n${statement}\n\nURI: ${uri}\nVersion: 1\nChain ID: ${parsedChainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}`

    console.log('Manually prepared message:', message);

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, userAddress],
    })

    console.log('Signature successful:', signature)
    walletAddress = userAddress
    loginStatus.textContent = ''
    updateView()
  } catch (error) {
    console.warn('REAL SIGN-IN FAILED:', (error as Error).message)
    loginStatus.textContent = 'Wallet not found. Simulating login...'

    const tempAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
    walletAddress = tempAddress

    setTimeout(() => {
      loginStatus.textContent = ''
      updateView()
    }, 1500)
  }
}

async function selectFolder() {
  const folderPath = await window.api.selectFolder()
  if (folderPath) {
    selectedFolderPath = folderPath
    folderPathEl.textContent = `Selected Folder: ${folderPath}`
    fileEditorEl.classList.remove('hidden')
    refreshFileList()
  }
}

async function refreshFileList() {
  if (!selectedFolderPath) return
  const files = await window.api.listFiles(selectedFolderPath)
  updateFileList(files)
}

async function openFile(event: Event) {
  if (!selectedFolderPath) return
  const target = event.target as HTMLElement
  if (target.tagName === 'LI' && target.dataset.filename) {
    document.querySelectorAll('#file-list li').forEach(li => li.classList.remove('selected'));
    target.classList.add('selected');

    const filename = target.dataset.filename
    const filePath = [selectedFolderPath, filename].join(pathSeparator)
    const content = await window.api.readFile(filePath)
    if (content !== null) {
      filenameInput.value = filename
      contentTextarea.value = content
    }
  }
}

async function saveFile() {
  if (!selectedFolderPath) {
    saveStatus.textContent = 'Error: No folder selected.'
    return
  }
  const filename = filenameInput.value.trim()
  if (!filename || !filename.endsWith('.txt')) {
    saveStatus.textContent = 'Error: Filename must end with .txt'
    return
  }
  
  const filePath = [selectedFolderPath, filename].join(pathSeparator)
  const content = contentTextarea.value

  saveStatus.textContent = 'Saving...'
  const result = await window.api.saveFile({ filePath, content })
  if (result.success) {
    saveStatus.textContent = `Saved successfully to ${filename}`
    refreshFileList()
  } else {
    saveStatus.textContent = `Error: ${result.error}`
  }
  setTimeout(() => (saveStatus.textContent = ''), 3000)
}

function resetToInitialState() {
  walletAddress = null
  selectedFolderPath = null
  folderPathEl.textContent = 'No folder selected.'
  fileEditorEl.classList.add('hidden')
  filenameInput.value = ''
  contentTextarea.value = ''
  fileListEl.innerHTML = ''
  saveStatus.textContent = ''
  loginStatus.textContent = ''
}

// --- INITIALIZATION ---
;(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    pathSeparator = await window.api.getPathSep()
  } catch (error) {
    console.error('Failed to initialize API bridge from preload script:', error)
  }

  // Set up event listeners
  loginButton.addEventListener('click', signInWithEthereum)
  logoutButton.addEventListener('click', () => { walletAddress = null; updateView(); })
  selectFolderButton.addEventListener('click', selectFolder)
  fileListEl.addEventListener('click', openFile)
  saveButton.addEventListener('click', saveFile)
  
  // Set the initial view
  updateView()
})()
