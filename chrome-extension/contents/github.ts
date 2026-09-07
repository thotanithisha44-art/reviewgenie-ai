export const config = {
  matches: ["https://github.com/*"]
}

console.log("ReviewGenie Loaded")

function injectButton() {
  if (!window.location.pathname.includes("/pull/")) {
    return
  }

  if (document.getElementById("reviewgenie-btn")) {
    return
  }

  const btn = document.createElement("button")

  btn.id = "reviewgenie-btn"
  btn.innerText = "🤖 Review with AI"

  Object.assign(btn.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "2147483647",
    padding: "12px 20px",
    background: "red",
    color: "white",
    border: "2px solid white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  })

  btn.onclick = () => {
    extractPRData()
  }

  document.body.appendChild(btn)

  console.log("Button Injected")
}

function extractDiff() {
  const codeBlocks = document.querySelectorAll(".blob-code")

  const diff = Array.from(codeBlocks)
    .map((block) => block.textContent || "")
    .join("\n")

  return diff
}

function extractPRData() {
  const title =
    document
      .querySelector('[data-component="PH_Title"]')
      ?.textContent?.trim() ||
    "Title not found"

  const url = window.location.href

  const parts = window.location.pathname.split("/")

  const owner = parts[1] || ""

  const repository = parts[2] || ""

const changedFiles = Array.from(
  document.querySelectorAll(
    '[data-testid="progressive-diffs-list"] a'
  )
)
  .map((el) => el.textContent?.trim())
  .filter(Boolean)

console.log("Changed Files:", changedFiles)

console.log(
  "Progressive Diffs:",
  document.querySelector('[data-testid="progressive-diffs-list"]')
)

  const diff = extractDiff()

  const prData = {
    title,
    owner,
    repository,
    url,
    filesCount: changedFiles.length,
    changedFiles,
    diff
  }

  console.log("PR DATA:", prData)

  showSidebar(prData)
}

function showSidebar(prData: any) {
  const existing = document.getElementById("reviewgenie-sidebar")

  if (existing) {
    existing.remove()
  }

  const sidebar = document.createElement("div")

  sidebar.id = "reviewgenie-sidebar"

  Object.assign(sidebar.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: "400px",
    height: "100vh",
    background: "#ffffff",
    borderLeft: "1px solid #ddd",
    zIndex: "2147483647",
    padding: "20px",
    overflowY: "auto",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.15)"
  })

  sidebar.innerHTML = `
    <h2>🤖 ReviewGenie AI</h2>

    <h3>PR Title</h3>
    <p>${prData.title}</p>

    <h3>Repository</h3>
    <p>${prData.owner}/${prData.repository}</p>

    <h3>Files Changed (${prData.filesCount})</h3>

    <ul>
      ${prData.changedFiles
        .map((file: string) => `<li>${file}</li>`)
        .join("")}
    </ul>
  `

  document.body.appendChild(sidebar)
}

setTimeout(injectButton, 3000)