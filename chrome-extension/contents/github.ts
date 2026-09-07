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
  const diffContainers = document.querySelectorAll(
    '[data-testid="diff-content"]'
  )

  const diff = Array.from(diffContainers)
    .map((container) => container.textContent || "")
    .join("\n")

  console.log("Diff Length:", diff.length)

  return diff
}

async function reviewPR(prData: any) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/review",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(prData)
      }
    )

    const result = await response.json()

    console.log("AI REVIEW:", result)

    showSidebar({
      ...prData,
      aiReview: result
    })
  } catch (error) {
    console.error("Review API Error:", error)
  }
}

function extractPRData() {
  const title =
    document
      .querySelector('[data-component="PH_Title"]')
      ?.textContent?.trim() || "Title not found"

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

  reviewPR(prData)
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
    width: "450px",
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

    <h3>Diff Preview</h3>

    <pre style="
      white-space: pre-wrap;
      background:#f5f5f5;
      padding:10px;
      border-radius:8px;
      max-height:250px;
      overflow:auto;
    ">
${prData.diff.substring(0, 1000)}
    </pre>

    ${
      prData.aiReview
        ? `
          <h3>AI Summary</h3>
          <p>${prData.aiReview.summary}</p>

          <h3>Issues</h3>
          <ul>
            ${prData.aiReview.issues
              .map((issue: string) => `<li>${issue}</li>`)
              .join("")}
          </ul>

          <h3>Suggestions</h3>
          <ul>
            ${prData.aiReview.suggestions
              .map((suggestion: string) => `<li>${suggestion}</li>`)
              .join("")}
          </ul>
        `
        : ""
    }
  `

  document.body.appendChild(sidebar)
}

setTimeout(injectButton, 3000)