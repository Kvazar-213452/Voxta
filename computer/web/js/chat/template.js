window.electronAPI.onMessage((data) => {
  if (data.type === "load_template") {
    $("#settings_div_m").html(data.templates["settings"]);
    $("#addChat_div_m").html(data.templates["addChat"]);
  }
});

export function loadTemplate() {
  window.electronAPI.sendMessage({
      type: "load_template"
  });
}
