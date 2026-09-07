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
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  })

  btn.onclick = () => {
    extractPRData()
  }

  document.body.appendChild(btn)

  console.log("Button Injected")
}

function extractPRData() {
  const title =
    document
      .querySelector('[data-component="PH_Title"]')
      ?.textContent?.trim() ||
    document
      .querySelector(".js-issue-title")
      ?.textContent?.trim() ||
    "Title not found"

  const url = window.location.href

  const parts = window.location.pathname.split("/")

  const owner = parts[1]
  const repository = parts[2]

  const prData = {
    title,
    owner,
    repository,
    url
  }

  console.log("PR DATA", prData)

  alert(`
PR Title:
${title}

Repository:
${owner}/${repository}
  `)
}

setTimeout(injectButton, 3000)