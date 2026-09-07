export const config = {
  matches: ["https://github.com/*"]
}

console.log("ReviewGenie Loaded")

function injectButton() {
  if (!window.location.pathname.includes("/pull/")) return

  if (document.getElementById("reviewgenie-btn")) return

  const btn = document.createElement("button")

  btn.id = "reviewgenie-btn"
  btn.innerText = "🤖 Review with AI"

  Object.assign(btn.style, {
    position: "fixed",
    top: "120px",
    right: "20px",
    zIndex: "999999",
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  })

  btn.onclick = () => {
    alert("Review Started 🚀")
  }

  document.body.appendChild(btn)

  console.log("Button Injected")
}

setTimeout(injectButton, 3000)